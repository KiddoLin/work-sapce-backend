Date.prototype.format = function(fmt) {
    return formatDate(fmt, this.getFullYear(), this.getMonth()+1, this.getDate(), this.getHours(), this.getMinutes(), this.getSeconds());
}

const formatDate = (fmt, y, M, d, h, m, s) => {
    var o = {
        "M+" : M,                 //月份
        "d+" : d,                    //日
        "h+" : h,                   //小时
        "m+" : m,                 //分
        "s+" : s,                 //秒
        "q+" : Math.floor((M+2)/3), //季度
    };
    if(/(y+)/.test(fmt)) {
            fmt=fmt.replace(RegExp.$1, (y+"").substr(4 - RegExp.$1.length));
    }
     for(var k in o) {
        if(new RegExp("("+ k +")").test(fmt)){
             fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
         }
     }
    return fmt;
}

const diffDays = (sStart, sEnd) => {
    var s = new Date(sStart).getTime();     
    var e = new Date(sEnd).getTime();     
    var days = parseInt((e - s))/(1000*60*60*24);     
    return  days;
}

module.exports = {
    Date,
    formatDate,
    diffDays
}
