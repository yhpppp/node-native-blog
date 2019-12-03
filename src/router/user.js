const { SuccessModel, ErrorModel } = require("../model/resModel");
const { login } = require("../controller/user");

const { set } = require("../db/redis");

const handleUserRouter = (req, res) => {
  // 请求用户登录
  if (req.method === "POST" && req.path === "/api/user/login") {
    var result = login(req.body);

    return result.then(data => {
      console.log("data :) ", data);

      if (data) {
        req.session.username = data.username;
        req.session.realname = data.realname;
        // 同步到redis
        console.log("req.session :) ", req.session);
        console.log("req.sessionId :) ", req.sessionId);

        set(req.sessionId, req.session);

        return new SuccessModel(data);
      } else {
        return new ErrorModel("登录失败");
      }
    });
  }

  // 登录验证测试
  // if (req.method === "GET" && req.path === "/api/user/login-test") {
  //   console.log("req.session :) ", req.session);

  //   if (req.session.username) {
  //     return Promise.resolve(
  //       new SuccessModel({ username: req.session.username })
  //     );
  //   }
  //   return Promise.resolve(new ErrorModel("登录失败"));
  // }
};

module.exports = handleUserRouter;
