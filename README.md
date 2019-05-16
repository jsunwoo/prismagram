# prismagram

Instagram clone project provided Nomadcoders

# User Stories

- [x] Create account
- [x] Request Secret
- [x] Confirm Secret (Login)


#1 Set Up

#1.0 Setting up the project

- yarn init

- yarn add graphql-yoga
- yarn add nodemon -D (변경시 재시작 해줌)
- yarn add babel-cli -D (컴파일러 역할)

- nodemon --exec babel-node src/server.js

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
  updateUser(
    data: { followers: { connect: { username: "jun" } } }
    where: { username: "jin" }
  ) {
    username
    following {
      username
    }
    followers {
      username
    }
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

- https://sendgrid.com/blog/sending-email-nodemailer-sendgrid/
- nodemailer 와 sendgrid 를 이용해서 메일로 secret key 를 보내줄 것임
- yarn add nodemailer-sendgrid-transport
- yarn add nodemailer
- sendgrid 에서 아이디/비밀번호를 만들고 .env에 저장했음
- 링크에 있는 내용대로 이메일 보내지고 스팸함 메일 확인완료

#3.4 Passport JWT part One

- secret token 일치를 확인하는 confirmSecret API 를 만듦
- http://www.passportjs.org/
- https://randomkeygen.com/ 에서 랜덤키 가져와서 .env 에 저장해줌
- 그리고 JWT 머시기를 만드는데 뭔소린지 하나도 모르겠음 아직까지는
- 내가 document 를 보고 혼자 할수 있을까 생각해봤는데 불가할 것 같음 처음이라 그러겠지만

