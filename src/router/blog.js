const { SuccessModel, ErrorModel } = require("../model/resModel");
const {
  getBlogList,
  getBlogDetail,
  setBlogUpdate,
  createPost,
  deletePost
} = require("../controller/blog");

// 登录验证
const loginCheck = request => {
  if (!request.session.username) {
    return Promise.resolve(new ErrorModel("尚未登录"));
  }
};

const handleBlogRouter = (request, response) => {
  const id = request.query.id;
  let body = request.body;
  console.log('body :)', body);
  console.log('request.session :)', request.session);
  
  body['username'] = body['username']?body['username']:request.session.username
  body['realname'] = body['realname']?body['realname']:request.session.realname
  body['password'] = body['password']?body['password']:request.session.password
  // 请求博客列表
  if (request.method === "GET" && request.path === "/api/blog/list") {
    let author = request.body.author || "";
    let keyword = request.body.keyword || "";


    if (request.query.isadmin) {
      // 管理员界面
      const loginCheckResult = loginCheck(request);
      if (loginCheckResult) {
        // console.log('loginCheckResult :) ', loginCheckResult);
        return loginCheckResult;
      }

      // 只查询自己的博客
      author = request.session.username;
    }

    let result = getBlogList(author, keyword);
    return result.then(data => {
      return new SuccessModel(data);
    });
  }
  // 请求博客列表
  if (request.method === "GET" && request.path === "/api/blog/detail") {
    const result = getBlogDetail(id);
    return result.then(data => {
      return new SuccessModel(data);
    });
    // return new SuccessModel(postData);
  }

  // 请求博客更新
  if (request.method === "POST" && request.path === "/api/blog/update") {
    const loginCheckResult = loginCheck(request);
    if (loginCheckResult) {
      return loginCheckResult;
    }
    const result = setBlogUpdate(id, body);
    return result.then(req => {
      return req ? new SuccessModel(req) : new ErrorModel("更新失败");
    });
  }

  // 请求博客添加
  if (request.method === "POST" && request.path === "/api/blog/new") {
    const loginCheckResult = loginCheck(request);
    if (loginCheckResult) {
      return loginCheckResult;
    }

    const result = createPost(body);

    return result.then(req => {
      return req ? new SuccessModel(req) : new ErrorModel("添加失败");
    });
  }

  // 请求博客删除
  if (request.method === "POST" && request.path === "/api/blog/delete") {
    const loginCheckResult = loginCheck(request);

    if (loginCheckResult) {
      return loginCheckResult;
    }
    const result = deletePost(id, request.session.username);
    return result.then(res => {
      return res ? new SuccessModel(res) : new ErrorModel("删除失败");
    });
  }
};

module.exports = handleBlogRouter;
