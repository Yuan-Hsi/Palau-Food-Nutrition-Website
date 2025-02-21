
class SizeHelper {
    constructor(size) {
        this.size = size;
    }

    adjust(scale) {
        return parseFloat(this.size) * scale + this.size.slice(-2);
    }
}

const transformDate = function(str) {
    const date = new Date(str);
    const d = date.getDate();
    const m = date.getMonth()+1;
    const y = date.getFullYear()
    return `${d} / ${m} / ${y}`;
}

const chunkArray = function(array) {
    const result = [];
    for (let i = 0; i < array.length; i += 5) {
      result.push(array.slice(i, i + 5));
    }
    return result;
  }

export default SizeHelper;
export {transformDate,chunkArray};
// 使用範例
/*
const mySize = new SizeHelper("16px");
console.log(mySize.adjust(1.5)); // "24px"
*/