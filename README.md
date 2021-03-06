# prismagram

Instagram clone project provided Nomadcoders



# User Stories

- [x] Create account
- [x] Request Secret
- [x] Confirm Secret (Login)
- [x] Like / Unlike a photo
- [x] Comment on a photo
- [x] Search by user
- [x] Search by location
- [x] Follow User
- [x] Unfollow User
- [x] Edit my profile
- [x] See user profile
- [x] See MY profile
- [x] See the full photo



#1 Set Up



#1.0 Setting up the project

- yarn init

- yarn add graphql-yoga
- yarn add nodemon -D (변경시 재시작 해줌)
- yarn add babel-cli -D (컴파일러 역할)

- script 에 추가함 nodemon --exec babel-node src/server.js



#1.1 Creating GraphQL Server

- yarn add dotenv
- yarn add @babel/{node,preset-env}
- yarn add @babel/core

- yarn (global) remove babel-cli
  Requires Babel "^7.0.0-0", but was loaded with "6.26.3". If you are sure you have a compatible version of @babel/core, it is likely that something in your build process is loading the wrong version.



#1.2 Setting Up the Server like the Pros

- yarn add morgan

- Express 는 GraphQL 서버에 포함되어있음
- 고로 server.express.use(logger("dev")); 를 사용할 수 있음

- yarn add graphql-tools merge-graphql-schemas



#2 Setting Up Prisma



#2.0 Introduction to Prisma

- prisma 에서 새로운 서비스 추가
- 인증 완료 후 prisma init 실행
- 세팅이 끝나면 generated 폴더는 gitignore 에 추가하고 prisma deploy
- datamodel.prisma 에서 data model 을 수정할 수 있음



#2.1 Datamodel with Prisma

- prisma 설명서에 보면 relation 과 directives 도 있음



#2.2 Testing Prisma OMG

- following: [User!]! @relation(name: "FollowRelation")
  followers: [User!]! @relation(name: "FollowRelation")
  으로 하니 자동 상호작용으로 followers/following 이 추가된다

- 쿼리는 다음처럼

mutation {
updateUser(data: { followers: { connect: { username: "jun" } } }where: { username: "jin" })
    {
        username
        following {username}
        followers {username}
    }
}



#2.3 Integrating Prisma in our Server

- yarn add prisma-client-lib (sayHello.js 에서 아래 줄을 추가할 때 필요)
- import { prisma } from "../../../../generated/prisma-client";
- console.log(await prisma.users()); (이렇게 쉽게 가져올수 있음;)
- 사용자 - 서버 - prisma - DB 구조로 되어있음



#2.4 Resolvers with Prisma

- graphql 는 prisma 의 @xx 를 이해하지 못하기 때문에 다 지워주고 models.graphql로 가져옴
- 가져오니 playground 에 schema 추가되었음 (당연?)
- allUsers, userById api를 추가하였음
- prisma 단점이 하나 있는데 recursive 한 공격을 막기 위해
- allUsers {
    username
    posts{
        id
    }
  }
- 와 같은 Query 는 못가져오게 막아놓았음



#3 GraphQL API



#3.0 Planning the API

- Usecases 정리 했음



#3.1 Create Account Resolver

- prisma 서버에 있는 createUser 와 내 서버의 createAccount 를 연결하여 계정을 생성함



#3.2 requestSecret Resolver

- randmom list 사이트에서 임의로 명사와 형용사를 가져옴
- shift + option + i 를 사용해서 배열을 만들었음
- 형용사와 명사를 섞어 랜덤으로 문장을 만듦 (utils.js)
- requestSecret 에서 email 으로 user 를 찾아서 loginSecret 칼럼을 수정해 주게끔 하였음



#3.3 sendMail Function with Nodemailer

- nodemailer 와 sendgrid 를 이용해서 메일로 secret key 를 보내줄 것임
- 참고: https://sendgrid.com/blog/sending-email-nodemailer-sendgrid/
- utils.js 에 추가함
- yarn add nodemailer-sendgrid-transport
- yarn add nodemailer
- sendgrid 에서 아이디/비밀번호를 만들고 .env에 저장했음
- 링크에 있는 내용대로 이메일 보내지고 스팸함 메일 확인완료



#3.4 Passport JWT part One

- secret token 일치를 확인하는 confirmSecret API 를 만듦
- http://www.passportjs.org/
- https://randomkeygen.com/ 에서 랜덤키 가져와서 .env 에 저장해줌 (JWT_SECRET)
- 그리고 JWT 머시기를 만드는데 뭔소린지 하나도 모르겠음 아직까지는
- 내가 document 를 보고 혼자 할수 있을까 생각해봤는데 불가할 것 같음 처음이라 그러겠지만



#3.5 Passport JWT part Two

- verifyUser 에서 user 값이 없거나 가져올때 오류나는 경우를 처리함 (passport.js)
- 이제 jsonwebtoken 을 만들어보자
- yarn add jsonwebtkeon
- 이제 confirmSecret 에서 secret key 값이 맞으면 토큰을 생성해서 반환해준다
- 이 토큰값을 해석하려면 passport 가 필요함
- passport.js 에서 오류가 났는데 설명서 보면서 어느정도 고칠수 있을것 같았다 어제와는 달리
- 완성된 passport 를 server 에 추가하고
- server.express.use(passport.authenticate("jwt"));
- 를 추가하였는데 아직 무슨 기능을 하는지 모르겠다



#3.6 Passport JWT part Three

- passport.js 에 미들웨어 함수를 만듦 (export const authenticateJwt 가 미들웨어 함수)
- 토큰을 받아서, 해석하고, 사용자를 찾고, 사용자가 존재하면, req 객체에 사용자를 추가하고, graphql 함수를 실행하는거야 (도대체 무슨소리냐)
- (추가) 실행순서 server.js => server.express.use(authenticateJwt); => passport.authenticate() => passport.use(new Strategy(jwtOptions, verifyUser)); => verifyUser 의 payload 가 토큰에서 id 를 추출해준다 => passport.authenticate() 로 돌아와서 req 에 user 를 추가함 => 그리고 server.js 로 돌아와 context 에 request 를 담아준다

(7'20" ~ 9'40")

- 계속 context 에 request 를 넣어서 어썸 하는데 나는 아직 잘 모르겠음
- (추가) context 는 resolver 사이에서 정보를 공유할때 사용
- const server = new GraphQLServer({ schema, context:{prisma} });
- 예를들어 위처럼 context 에 prisma 를 추가했을 때
- createAccount.js 에서 prisma 를 import 하지 않고
- createAccount: async (\_, args, { prisma }) 해서 prisma 를 사용할 수 있음
- 단 자동완성 기능은 안된다, 하지만 사람들이 많이 사용하고 있음 (db 등으로 치환해서)

- context 에는 함수를 담을수도 있음
- const server = new GraphQLServer({ schema, context: req => { console.log(req); } });
- 하고 req 을 찍어보니 정말 방대한 자료가 나온다 (무엇일까 이게?)
- req 안에있는 request 가 passport 와 연관된 진짜 request 이라고 한다
- const server = new GraphQLServer({ schema, context: ({ request }) => ({ request }) });
- 그래서 이렇게 context 로 request 를 보냈고 allUsers.js 에서 console.log 를 찍어보았다
- 이거또한 겁나 방대한 자료가 나온다..
- allUsers query 를 보낼때 HTTP HEADERS 에
- {"Authorization" : "Bearer token값"}
- 같이 추가해서 보냈더니 log 에 token 값이 해석된 user 가 추가되어 나왔다

- 최종정리

1. 모든 request 는 server.js 의 server.express.use(authenticateJwt) 를 거침
2. 그러면 authenticateJwt 안에 있는 passport.authenticate() 를 실행함
3. passport.authenticate() 는 newStrategy() 함수를 이용함
4. jwtFromRequest 가 header 에서 토큰을 추출해온다
   ( 4-5 사이 과정이 헷갈리는게 payload 를 보면 이미 토큰을 해석해서 id 를 갖고있는데 이 과정이 안보인다 )
   ( payload 가 token 에서 id 를 추출하는 기능이 있다고함 )
   ( 애초에 token 을 생성할때도 id 만 사용하는구나, token 에 user 정보가 다 들어있는게 아니고 id 값만 담겨있는 것 같다 )
5. verifyUser() 가 payload 에서 id 를 가져와 prisma 에서 user 를 찾아와 반환해준다
6. 그리고 callback 함수로 인해 passport.authenticate() 로 돌아와 req 에 user 를 저장한다
7. server.js 위치한 GraphQLServer() 에서 request 가 context 에 추가된다
8. 비로써 context 에 추가된 request 에서 user 를 확인할 수 있다



#3.7 toggleLike Resolver part One

- 3.11 을 보다가 middlewares.js 가 필요해서 여기까지 올라왔다
- request 에서 user 를 찾아서 없으면 error 를 던져주는 역할을 하는 isAuthenticated 를 만들었다
- 만들고 context 에 넣어 범용적으로 사용하게 해놓았다!! (다른강의인가?)

- token 을 헤더에 넣고 toggleLike API 가 playground 에서 잘 돌아가는 것 까지 확인했다

- https://www.prisma.io/docs/prisma-client/features/check-existence-TYPESCRIPT-pyl2/#overview
- prisma 진짜 끝장나는게.. 값이 있는지 없는지 찾아서 true/false 로 반환해 주는 기능이 자체적으로 있다.. 대박
- 그렇게 prisma.$exist 를 만들고 있다

- 이 위대한 $exist 로 user.id, postID 값으로 like 가 있는지 확인해준다
- 있다면 지울것이고 (아직 구현은 안했고 To Do로 남겨놓았음)
- 없다면 이 user 와 post 를 connect 로 연결한 새로운 like 를 만들것이다
- 그렇게 toggle 을 완료하면 true 값을 반환, 비동기 중에 오류가 나면 false 를 반환하게 만들었다



#3.8 toggleLike and addComment Resolver

- deleteLike 보다는 deleteManyLikes 를 쓰기로 했다
- 이유는 deleteLike 에서는 Like 의 아이디가 필요한데 지금 갖고있는 정보는 user, post 이기 때문에 사용할 수 없다
- user, post 를 and 연산자로 사용하여 Like 를 찾았고 이 연산자를 이용하여 deleteManyLikes 도 했다
- 오탈자로 오류가 잠깐 있었지만 고치고 잘 되는 지 확인했다
- 그리고 null 처리에 대해 생각했다 필요없을 것 같은 부분도 대비를 해야 하는가에 대해서

- API 를 table 별로 관리하는 것도 괜찮은 생각인것 같다

- 그리고 addComment API 를 만들었다
- prisma 가 정말 아름답긴 아릅답다.. 이렇게 간단하게 컬럼을 추가하고 다른 컬럼을 연결하고 할수 있다니!



#3.9 searchUser and searchImage resolver

- 단 세줄만에 term 을 포함하고 있는 모든 user 를 리턴해주는 API 를 만들었다
- prisma 의 위대함에 또 한번 놀라고 갑니다..
- prisma playground 에 가보면 where 절에 뭘 쓸수 있는지 다 나와있다 (많기도하다)
- users, posts, likes 등 복수형만 저 다양한 where 절을 사용할 수 있다 (contain, start_with 와 같은)
- 왜냐면 복수로 리턴을 받아야 하기 때문

- 비슷하게 searchPost API 를 만들어 주었다
- searchUser 는 where 절에 contains 를 썼지만 searchPost 는 start with 를 썼다
- 확인해 보니 아주 잘된다 나중에 minimum required 를 넣어서 몇글자 이상만 검색 되게끔 해도 좋을것 같다


- 그리고 async 를 await 도 없는데 꼭 넣어야 하는지(?) 그게 궁금해졌다



#3.10 follow unfollow Resolver

- follow 를 만들었다
- connect 에 id 를 가진 user 를 찾아주는 기능까지 포함되어 있나보다 따로만드려 했으나 필요없었다
- 정말 대단한 prisma 인 것이었다!!
- 그리고 following 하니까 상대방 follower 에 내가 자동적으로 추가되었다
- datamodel 에서 정의한 relation 에 의한 효과였다
- 정말 대단한 prisma 이었던 것이었다!!!!

- 그리고 동일하게 unfollow API 를 만들었다
- connect 를 disconnect(안보고 만들어보다가 설마하고 해봤는데 있었다.. prisma)로 바꾼것밖에 없는 거의 동일한 기능

- 그리고 confirmSecret 에서 loginSecret 확인한 뒤 초기화 시켜주게끔 바꾸었다

- 그리고 token 부분 전체적인 프로세스 한번 더 복습해야 할듯 아직도 잘 모르겠다



#3.11 editUser seeUser Resolver

- 보고있는데 middlewares.js 가 필요하다

- 유저 데이터를 수정하는 editUser 파일을 만들었다
- isAuthenticated 를 context 에 넣었다 (server.js)
- 테스트 해봤는데 기존 데이터도 잘 보존하고 새로운 데이터로 잘 바꿔준다 끝내주네 프리즈마

- return 에서는 굳이 promise 를 안써도 된다
- 왜냐하면 마지막 이기때문에 자동으로 return 할 내용을 기다려주기 때문

- 기존의 userById 와 같은 기능을 하는 seeUser 를 만들었다 (아이디로 유저를 찾아주는 것임)



#3.12 me Resolver + Prisma's Limitations

- me 라는 API 를 만들고 있다

- return prisma.user({ id: user.id }).posts();
- 를 니콜라스가 시도했는데 잘 안됐고 덕분에 나도 잘 모르겠다?;
- 별거 아니였고 그냥 user 에 있는 posts 컬럼을 가져오는 것이었다
- 동일하게 following 으로 실험해보니 잘됨

- return prisma.user({ id: user.id }).$fragment();
- 로 바꿔서 시도하는중
- fragments.js 를 만들었다 (아마 이정보 저정보 가져와서 합치는 모양 조각이란 뜻이니까)
- 예전에 recursive 공격 방지하기 위해 여러 테이블에서 못가져오게 막아놨다고 했지?
- 그거의 해결방법이 fragment 이다
- fragment 에 없는 column 은 null 로 반환해준다 (꼭 fragment 에 기입할것)

- fragment 를 안쓰려면 다음과 같이 할수있다
- query 에서 부터 user, posts 두테이블을 한꺼번에 요청한다
- const userProfile = await prisma.user({ id: user.id });
- const posts = await prisma.user({ id: user.id }).posts();
- 다음과 같이 user, posts 를 두개 다불러온뒤 return 해준다



#3.13 See Full Posts

- 보고있는데 seeUser API 가 필요하다

- seeUser 쿼리를 User 말고 UserProfile 로 리턴 받게 함
- UserProfile 은 models 에 추가했고 User, Posts 두개 다를 포함한 타입임
- 그리고 seeUser.js 에서 user, post 두개 다 받아와서 리턴을 해주게 만들었음

- seeFullPost API 를 만들기 시작했다!
- Post 와 Post 에 있는 Comments, 그리고 좋아요 숫자를 반환해 주는 API 인것이다!
- https://www.prisma.io/docs/prisma-client/basic-data-access/reading-data-JAVASCRIPT-rsc2/#aggregations
- 여기서 count 를 가지고와서 Like 수를 셀 계획인가봄 ( 이걸 알고있어야 찾을수 있을텐데 알고 있다는게 신기하다 )
- 니코의 강의를 보지도 않고 혼자서 어제 갖고 있던 문제들을 다 해결했다, 어제는 어려울수 있지 오늘은 아니다

- toggleLike 을 사용하는데 나중에 하자.. 너무 많이 왔다갔다 했다

- COMMENT_FRAGMENT 라는 fragment 를 만들었다
- comment 를 불러올 때 누가 작성했는지 확인하기 위해 user 를 같이 부르는데 이때 관계가 필요해서 fragment 를 사용함

- 그리고 아무래도 앞에서 부터 듣는게 맞는것 같다..
