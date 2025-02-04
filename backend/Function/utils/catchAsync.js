module.exports = (fn) => {
  // 將原本的 try{} catch{} 變成 promise 的鏈結來做
  return (req, res, next) => {
    fn(req, res, next).catch(next); // next 會接到 app.js 的 errorHandler 當中 （因為他是 middleware）
  };
};
