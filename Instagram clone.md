# Instgram clone

### 1

graphQL, resolver, schema/type ?? 

### GraphQL?

웹 클라이언트가 데이터를 서버로부터 효율적으로 가져오는 것이 목표, 클라이언트 시스템에서 작성, 호출

VS sql : sql은 데이터베이스 시스템에 저장된 데이터를 효율적으로 가져오는 것이 목적, 백엔드 시스템에서 작성, 호출

**graphql-yoga** : Graphql 서버 실행을 도와주는 도구

EX:

```json
{
  hero {
    name
    friends {
      name
    }
  }
}
```

![graphql-mobile-api.png (800×400)](https://tech.kakao.com/files/graphql-mobile-api.png)

**vs REST API**

### GraphQL의 구조

**스키마/타입(schema/type)**

gql 스키마 작성은 C,C++의 헤더파일 작성에 비유할 수 있다.

​	**오브젝트 타입과 필드**

```
type Character {
  name: String!
  appearsIn: [Episode!]!
}
```

- 오브젝트 타입 : Character
- 필드 : name, appearsIn
- 스칼라 타입 : String, ID, Int 등
- 느낌표(!) : 필수값(non-nullable)
- 대괄호([,]): 배열



**리졸버(resolver)**

gql 쿼리에서는 각각의 필드마다 함수가 하나씩 존재한다. 이 함수는 다음 타입을 반환한다. 이러한 함수들을 리졸버(resolver)라고 한다.

gql에서 데이터를 가져오는 구체적인 과정을 **resolver**가 담당한다. 직접 구현해야 한다.

&#10140; 데이터 source의 종류에 상관없이 구현 가능 ex) DB, file, http, SOAP, ...



**정리**

- 스키마 작성 and 리졸버 작성 &#10140; 한 파일(schema.js)에 모아서 `GraphQLServer()`의 인자로 넘겨준다.(서버님, 이 데이터들을 이렇게 다루세요~)

schema.js 중 일부

```javascript
const allTypes= fileLoader(path.join(__dirname, "/api/**/*.graphql"));
const allResolvers= fileLoader(path.join(__dirname, "/api/**/*.js"));   // should not put something that is not resolver  with .js


const schema = makeExecutableSchema({
    typeDefs: mergeTypes(allTypes),
    resolvers: mergeResolvers(allResolvers)
});

export default schema;
```

`/api`에 모든 스키마, 리졸버들을 모아놓고, 모아서 `schema`를 export해준다.

- Javscript `export` : 함수, 객체, 원시 값을 내보낼 때 사용, 후에 `import`로 가져다 쓸 수 있다.

### 2

**Prisma**

![post-thumbnail](https://media.vlpt.us/post-images/gtah2yk/c31f6110-2fae-11ea-98f4-03889cf558a1/Untitled-1.png)

**데이터모델(Datamodel)**에 따라 `Prisma Client`가 레코드들을 CRUD할 수 있는 `API`를 자동으로 생성한다.

모델을 정의할 때도 **graphql**의 문법을 사용한다.

ex)

```
type User {
  id: ID! @id
  username: String! @unique
  email: String! @unique
  firstName: String @default(value: "")
  lastName: String
  bio: String
  post: [Post!]!
  likes: [Like!]!
  comments: [Comment!]!
  follwers: [User!]!  @relation(name: "FollowRelation")
  following: [User!]! @relation(name: "FollowRelation")
  rooms: [Room!]!
}
```

@~ 는 directive들인데 이건 prisma 문법이다.

prisma datamodel을 작성해주고 `$prisma deploy` 해주면 알아서 `API`만들어줘서, 그거 사용해서 prisma server에 요청하면 적절한 응답을 돌려준다.

- 리졸버를 prisma를 이용해 사용하려면 import 해주고 사용하면 된다.

ex)

allUsers.graphql (스키마)

```
type Query{
    allUsers: [User!]!
}
```

allUsers.js (리졸버)

```javascript
import { prisma } from "../../../../generated/prisma-client";

export default {
    Query:{
        allUsers: ()=> prisma.users()
    }
}
```



Request

```
{
 	allUsers{
    id
    firstName
  }
}
```

Response

```
{
  "data": {
    "allUsers": [			//prisma.users()를 사용한 결과물
      {
        "id": "ckcd8bwdzkg4n0975cl1yl9wa",
        "firstName": "bbang"
      }
    ]
  }
}
```



**Mutation** vs **Query** : **Mutation**은 데이터를 쓰는 것에 대한 요청, **Query**는 읽는 것에 대 한 요청.



### 3

필요한 API들을 만들어보자.

-[X] Create account : 

prisma에서 제공하는 api를 이용해 유저를 쉽게 생성할 수 있다. 스키마를 만들고, 리졸버에서 prisma에서 제공하는 api를 사용한다. Create는 데이터를 쓰는 것에 대한 요청이기 때문에 Mutation 타입을 만들어 준다.

-[ ] Request Secret

-[ ] Confirm Secret (Login) : 

서버에 전달되는 요청은 `authenticateJwt()`(미들웨어 함수)를 지나게 되는데 

`authenticateJwt()`에서는 `passport.authenticate('jwt')` 를 실행한다.

`passport.use(new Strategy(jwtOptions, verifyUser));` 에서 Strategy를 활용해서 jwt 토큰을 추출하고(`Authorizaion` 헤더로부터), 추출되면 `verifyUser(payload,done)`을 실행한다. `verfiyUser`에서는 payload에서 해석된 id를 받고, id에 해당하는 user를 추출한다(prisma 클라이언트 api 활용).

user를 찾으면 콜백함수를 실행하여 req에 user를 추가한다.

그러면 server.js에서 context에 request를 담아주고, 이 request를 리졸버들이 사용하게 된다.

-[ ] Like / Unlike a photo

-[ ] Comment on a photo

-[ ] Search by user

-[ ] Search by location

-[ ] See user profile

-[ ] Follow / Unfollow User

-[ ] See the Full Photo

-[ ] Edit my profile

-[ ] Upload photos

-[ ] Edit the photo(Delete)

-[ ] See the feed

