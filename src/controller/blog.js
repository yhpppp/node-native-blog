const exec = require("../db/mysql");



/**
 * r
 * @param {*} author
 * @param {*} keyword
 */
const getBlogList = (author, keyword) => {
  let sql = "select * from posts where 1=1 ";

  if (author) {
    sql += `and author='${author}' `;
  }

  if (keyword) {
    sql += `and title like '%${keyword}%' `;
  }

  sql += "order by createtime desc;";

  return exec(sql);
};

/**
 * r
 * @param {*} id
 */
const getBlogDetail = id => {
  let sql = `select * from posts where id=${id};`;

  return exec(sql).then(data => {
    return data[0];
  });
};

/**
 * u
 * @param {d} id 
 * @param {*} updateData 
 */
const setBlogUpdate = (id, updateData = {}) => {
  console.log("updateData", updateData);
  console.log("id ", id);

  let { title, content } = updateData;
  let sql = `update posts set title='${title}', content='${content}' where id = ${id};`;
  return exec(sql).then(result => {
    console.log(result);
    if (result.affectedRows === 1) {
      return true;
    } else {
      return false;
    }
  });
};

/**
 * c
 * @param {d} body 
 */
const createPost = body => {
  let { title, author, content } = body;

  let createtime = Date.now();
  var sql = `insert into posts (title, author, content, createtime) values ('${title}', '${author}', '${content}', '${createtime}')`;

  return exec(sql).then(data => {
    return {
      result: data.affectedRows
    };
  });

  // return 1;
};

/**
 * d
 * @param {*} id 
 */
const deletePost = id => {
  let sql = `delete from posts where id = ${id}`;
  console.log("delete id", id);
  return exec(sql).then(result => {
    return result.affectedRows === 1 ? true : false;
  });
};

module.exports = {
  getBlogList,
  getBlogDetail,
  setBlogUpdate,
  createPost,
  deletePost
};
