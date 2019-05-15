# prismagram

Instagram clone project provided Nomadcoders

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