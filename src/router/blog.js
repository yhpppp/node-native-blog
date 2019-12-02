const { SuccessModel, ErrorModel } = require("../model/resModel");
const {
  getBlogList,
  getBlogDetail,
  setBlogUpdate,
  createPost,
  deletePost
} = require("../controller/blog");

const handleBlogRouter = (request, response) => {
  const id = request.query.id;
  const body = request.body;
  // 请求博客列表
  if (request.method === "GET" && request.path === "/api/blog/list") {
    const author = request.query.author || "";
    const keyword = request.query.keyword || "";
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
    const result = setBlogUpdate(id, body);
    return result.then(req => {
      return req ? new SuccessModel(req) : new ErrorModel("更新失败");
    });
  }

  // 请求博客添加
  if (request.method === "POST" && request.path === "/api/blog/new") {
    const result = createPost(body);

    return result.then(req => {
      return req ? new SuccessModel(req) : new ErrorModel("添加失败");
    });
  }

  // 请求博客删除
  if (request.method === "POST" && request.path === "/api/blog/delete") {
    const result = deletePost(id);
    return result.then(res => {
      return res ? new SuccessModel(res) : new ErrorModel("删除失败");
    });
  }
};

module.exports = handleBlogRouter;
