
// body 가 엄청 커질 수도 있으니까 shortBody 이거 만들어서 FlatList 에는 얘만 보여줄까?

const petLogMockData = [
  {
    id:1,
    titleImage:"https://newsimg.hankookilbo.com/cms/articlerelease/2021/04/04/92d75491-17fd-4276-a5db-a4426c8951f0.jpg",
    title:"1타이틀",
    body:"1바디바디바디바디바디바디바디바디바디바fjljaskldjfklasjdlfkjklkjlfkasjdlfsjdlkfjsjdgklaslkfnkzjxcbkvj.bnkjfdnkjbsdfalkdfnvkljz.n.bvcb.fadn.kjb kdjf.cvb",
    createdAt:"2022-05-20T07:50:45.673Z",
    "user": {
      "__typename": "User",
      "id": 3,
      "userName": "abcde김치qh음밥",
      // avatar: "https://newsimg.hankookilbo.com/cms/articlerelease/2021/04/04/92d75491-17fd-4276-a5db-a4426c8951f0.jpg",
    },
  },
  {
    id:2,
    titleImage:"https://img.sbs.co.kr/newsnet/etv/upload/2021/05/10/30000687264.jpg",
    title:"2타이틀",
    body:"2바디바디바디바디바디바디바디바디바디바fjljaskldjfklasjdlfkjklkjlfkasjdlfsjdlkfjsjdgklaslkfnkzjxcbkvj.bnkjfdnkjbsdfalkdfnvkljz.n.bvcb.fadn.kjb kdjf.cvb",
    createdAt:"2022-05-20T07:50:45.673Z",
    "user": {
      "__typename": "User",
      "id": 3,
      "userName": "abcde김치qh음밥",
      avatar: "https://newsimg.hankookilbo.com/cms/articlerelease/2021/04/04/92d75491-17fd-4276-a5db-a4426c8951f0.jpg",
    },
  },
  {
    id:3,
    titleImage:"https://img.theqoo.net/img/BcNkq.png",
    title:"3타이틀",
    body:"3바디바디바디바디바디바디바디바디바디바fjljaskldjfklasjdlfkjklkjlfkasjdlfsjdlkfjsjdgklaslkfnkzjxcbkvj.bnkjfdnkjbsdfalkdfnvkljz.n.bvcb.fadn.kjb kdjf.cvb",
    createdAt:"2022-05-20T07:50:45.673Z",
    "user": {
      "__typename": "User",
      "id": 3,
      "userName": "abcde김치qh음밥",
      avatar: "https://newsimg.hankookilbo.com/cms/articlerelease/2021/04/04/92d75491-17fd-4276-a5db-a4426c8951f0.jpg",
    },
  },
  {
    id:4,
    titleImage:"https://img.theqoo.net/img/JFpMc.png",
    title:"3.5타이틀",
    body:"3.5바디바디바디바디바디바디바디바디바디바fjljaskldjfklasjdlfkjklkjlfkasjdlfsjdlkfjsjdgklaslkfnkzjxcbkvj.bnkjfdnkjbsdfalkdfnvkljz.n.bvcb.fadn.kjb kdjf.cvb",
    createdAt:"2022-05-20T07:50:45.673Z",
    "user": {
      "__typename": "User",
      "id": 3,
      "userName": "abcde김치qh음밥",
      avatar: "https://newsimg.hankookilbo.com/cms/articlerelease/2021/04/04/92d75491-17fd-4276-a5db-a4426c8951f0.jpg",
    },
  },
  {
    id:5,
    titleImage:"https://img.theqoo.net/img/pfqel.png",
    title:"4타이틀",
    body:"4바디바디바디바디바디바디바디바디바디바fjljaskldjfklasjdlfkjklkjlfkasjdlfsjdlkfjsjdgklaslkfnkzjxcbkvj.bnkjfdnkjbsdfalkdfnvkljz.n.bvcb.fadn.kjb kdjf.cvb",
    createdAt:"2022-05-20T07:50:45.673Z",
    "user": {
      "__typename": "User",
      "id": 3,
      "userName": "abcde김치qh음밥",
      avatar: "https://newsimg.hankookilbo.com/cms/articlerelease/2021/04/04/92d75491-17fd-4276-a5db-a4426c8951f0.jpg",
    },
  },
  {
    id:6,
    titleImage:"https://img.theqoo.net/img/qhvBM.png",
    title:"5타이틀",
    body:"5바디바디바디바디바디바디바디바디바디바fjljaskldjfklasjdlfkjklkjlfkasjdlfsjdlkfjsjdgklaslkfnkzjxcbkvj.bnkjfdnkjbsdfalkdfnvkljz.n.bvcb.fadn.kjb kdjf.cvb",
    createdAt:"2022-05-20T07:50:45.673Z",
    "user": {
      "__typename": "User",
      "id": 3,
      "userName": "abcde김치qh음밥",
      avatar: "https://newsimg.hankookilbo.com/cms/articlerelease/2021/04/04/92d75491-17fd-4276-a5db-a4426c8951f0.jpg",
    },
  },
  {
    id:7,
    titleImage:"https://img.theqoo.net/img/bryFr.png",
    title:"6타이틀",
    body:"6바디바디바디바디바디바디바디바디바디바fjljaskldjfklasjdlfkjklkjlfkasjdlfsjdlkfjsjdgklaslkfnkzjxcbkvj.bnkjfdnkjbsdfalkdfnvkljz.n.bvcb.fadn.kjb kdjf.cvb",
    createdAt:"2022-05-20T07:50:45.673Z",
    "user": {
      "__typename": "User",
      "id": 3,
      "userName": "abcde김치qh음밥",
      avatar: "https://newsimg.hankookilbo.com/cms/articlerelease/2021/04/04/92d75491-17fd-4276-a5db-a4426c8951f0.jpg",
    },
  },
  {
    id:8,
    titleImage:"https://img.theqoo.net/img/CpoNP.png",
    title:"7타이틀",
    body:"7바디바디바디바디바디바디바디바디바디바fjljaskldjfklasjdlfkjklkjlfkasjdlfsjdlkfjsjdgklaslkfnkzjxcbkvj.bnkjfdnkjbsdfalkdfnvkljz.n.bvcb.fadn.kjb kdjf.cvb",
    createdAt:"2022-05-20T07:50:45.673Z",
    "user": {
      "__typename": "User",
      "id": 3,
      "userName": "abcde김치qh음밥",
      avatar: "https://newsimg.hankookilbo.com/cms/articlerelease/2021/04/04/92d75491-17fd-4276-a5db-a4426c8951f0.jpg",
    },
  },
  {
    id:9,
    titleImage:"https://img.theqoo.net/img/vfOjh.png",
    title:"8타이틀",
    body:"8바디바디바디바디바디바디바디바디바디바fjljaskldjfklasjdlfkjklkjlfkasjdlfsjdlkfjsjdgklaslkfnkzjxcbkvj.bnkjfdnkjbsdfalkdfnvkljz.n.bvcb.fadn.kjb kdjf.cvb",
    createdAt:"2022-05-20T07:50:45.673Z",
    "user": {
      "__typename": "User",
      "id": 3,
      "userName": "abcde김치qh음밥",
      avatar: "https://newsimg.hankookilbo.com/cms/articlerelease/2021/04/04/92d75491-17fd-4276-a5db-a4426c8951f0.jpg",
    },
  },
  {
    id:10,
    titleImage:"https://img.theqoo.net/img/jAacv.png",
    title:"9타이틀",
    body:"9바디바디바디바디바디바디바디바디바디바fjljaskldjfklasjdlfkjklkjlfkasjdlfsjdlkfjsjdgklaslkfnkzjxcbkvj.bnkjfdnkjbsdfalkdfnvkljz.n.bvcb.fadn.kjb kdjf.cvb",
    createdAt:"2022-05-20T07:50:45.673Z",
    "user": {
      "__typename": "User",
      "id": 3,
      "userName": "abcde김치qh음밥",
      avatar: "https://newsimg.hankookilbo.com/cms/articlerelease/2021/04/04/92d75491-17fd-4276-a5db-a4426c8951f0.jpg",
    },
  },
  {
    id:11,
    titleImage:"https://img.theqoo.net/img/pZbnw.png",
    title:"10타이틀",
    body:"10바디바디바디바디바디바디바디바디바디바fjljaskldjfklasjdlfkjklkjlfkasjdlfsjdlkfjsjdgklaslkfnkzjxcbkvj.bnkjfdnkjbsdfalkdfnvkljz.n.bvcb.fadn.kjb kdjf.cvb",
    createdAt:"2022-05-20T07:50:45.673Z",
    "user": {
      "__typename": "User",
      "id": 3,
      "userName": "abcde김치qh음밥",
      avatar: "https://newsimg.hankookilbo.com/cms/articlerelease/2021/04/04/92d75491-17fd-4276-a5db-a4426c8951f0.jpg",
    },
  },
  {
    id:12,
    titleImage:"https://img.theqoo.net/img/VUlwx.png",
    title:"11타이틀",
    body:"11바디바디바디바디바디바디바디바디바디바fjljaskldjfklasjdlfkjklkjlfkasjdlfsjdlkfjsjdgklaslkfnkzjxcbkvj.bnkjfdnkjbsdfalkdfnvkljz.n.bvcb.fadn.kjb kdjf.cvb",
    createdAt:"2022-05-20T07:50:45.673Z",
    "user": {
      "__typename": "User",
      "id": 3,
      "userName": "abcde김치qh음밥",
      avatar: "https://newsimg.hankookilbo.com/cms/articlerelease/2021/04/04/92d75491-17fd-4276-a5db-a4426c8951f0.jpg",
    },
  },
  {
    id:13,
    titleImage:"https://images.chosun.com/resizer/7kXxHy8naZdo9B-le4E4rL0qBHc=/616x0/smart/cloudfront-ap-northeast-1.images.arcpublishing.com/chosun/DRIAM3EWXQ6VQEKR35USMDSSWE.jpg",
    title:"12타이틀",
    body:"rlqlkndflkjdlkfg",
    createdAt:"2022-05-20T07:50:45.673Z",
    "user": {
      "__typename": "User",
      "id": 3,
      "userName": "abcde김치qh음밥",
      avatar: "https://newsimg.hankookilbo.com/cms/articlerelease/2021/04/04/92d75491-17fd-4276-a5db-a4426c8951f0.jpg",
    },
  },
];

export default petLogMockData;