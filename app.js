const handleBlogRouter = require("./src/router/blog");
const handleUserRouter = require("./src/router/user");
const { get, set } = require("./src/db/redis");
const querystring = require("querystring");

// session 数据
let SESSION_DATA = {};

const getPostData = request => {
  const promise = new Promise((resolve, reject) => {
    if (request.method !== "POST") {
      resolve({});
      return;
    }
    if (request.headers["content-type"] !== "application/json") {
      resolve({});
      return;
    }

    let postData = "";
    request.on("data", chunk => {
      postData += chunk.toString();
    });
    request.on("end", () => {
      if (!postData) {
        resolve({});
        return;
      }
      // console.log("end postData", postData);

      resolve(postData);
    });
  });
  return promise;
};
// 获取 Cookie 到期时间
const getCookieExpire = () => {
  const d = new Date();
  d.setTime(d.getTime() + 24 * 60 * 60 * 1000);
  // d.setTime(d.getTime() + 10 * 1000);
  // console.log("d.toGMTString() :) ", d.toGMTString());
  console.log('getCookieExpire run');
  
  return d.toGMTString();
};

const handleServer = (request, response) => {
  response.setHeader("Content-Type", "application/json");
  var url = request.url;
  if (url === "/favicon.ico") return;
  request.path = url.split("?")[0];

  request.query = querystring.parse(url.split("?")[1]);

  //  // 获取cookie
  //  req.cookie = {}
  //  const cookieStr = req.headers.cookie || ''
  //  cookieStr.split(';').forEach(item => {
  //      if (!item) {
  //          return
  //      }
  //      const arr = item.split('=')
  //      const key = arr[0].trim()
  //      const val = arr[1].trim()
  //      req.cookie[key] = val
  //  })
  //  console.log('cookie is ', req.headers.cookie)
  
  // 解析 cookie
  request.cookie = {};
  // console.log('request.headers.cookie :) ', request.headers.cookie);
  let cookieStr = request.headers.cookie || "";

  cookieStr.split(";").forEach(element => {
    if (!element) {
      return;
    }

    const itemArr = element.trim().split("=");
    // ;console.log('itemArr :) ', itemArr);
    
    let key = itemArr[0];
    let value = itemArr[1];
    request.cookie[key] = value;
  });

  // 使用redis 解析session
  let needSetCookie = false;
  let userId = request.cookie.userid;

  if (!userId) {
    console.log(" :( ");

    needSetCookie = true;
    userId = `${Date.now()}_${Math.random()}`;

    // 初始化session
    set(userId, {});
  }
  // 获取 session
  request.sessionId = userId;

  get(request.sessionId)
    .then(sessionData => {
      // 返回空值则初始化sessionData
      if (sessionData === null) {
        set(request.sessionId, {});
        // 设置session
        request.session = {};
      } else {
        // 设置session
        request.session = sessionData;
      }
      return getPostData(request);
    })
    .then(postdata => {
      if (Object.getOwnPropertyNames(postdata).length === 0) {
        request.body = "";
      } else {
        request.body = JSON.parse(postdata);
        // console.log('request.body  :)  ', request.body );
        
      }

      // 博客路由处理
      var blogDataResult = handleBlogRouter(request, response);

      if (blogDataResult) {
        blogDataResult.then(blogData => {
          // console.log("blogData :) ", blogData);
          if (needSetCookie) {
            // console.log("needSetCookie :) ", needSetCookie);

            response.setHeader(
              "Set-Cookie",
              `userid=${userId}; path=/; httpOnly; expires=${getCookieExpire()};`
            );
          }
          response.end(JSON.stringify(blogData));
        });
        return;
      }

      // 用户路由处理
      var userData = handleUserRouter(request, response);

      if (userData) {
        userData.then(userResult => {
          if (needSetCookie) {
            response.setHeader(
              "Set-Cookie",
              `userid=${userId}; path=/; httpOnly; expires=${getCookieExpire()};`
            );
          }
          response.end(JSON.stringify(userResult));
        });
        return;
      }

      // 404
      response.writeHeader(404, { "Content-Type": "text/plain" });
      // console.log(111);
      response.end("404 Not Found");
    });
};

module.exports = handleServer;
