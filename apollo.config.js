module.exports = {
  client:{
    service:{
      includes:["./src/**/*.{ts,tsx}"],
      tagName:"gql",
      // name 바꿔야?
      name:"backend",
      // url 배포주소로?
      url:"http://localhost:4000/graphql",
    }
  }
}