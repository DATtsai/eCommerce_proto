export default function(timestamp){
    const unixTimestamp = Number(timestamp);
    let date = new Date(unixTimestamp * 1000);
    // let isoDate = date.toISOString().split('T')[0];     // toISOString()會轉成字串，時區為GMT+0000 '2020-02-03T16:53:33.000Z'
    // let isoTime = isoDate[1].split('.')[0];
    let localDate = [
        date.getFullYear(),
        date.getMonth()+1,
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds(),
    ];
    let presentDate = (function(localDate){
        function pad(number) {
            if (number < 10) {
              return '0' + number;
            }
            return number;
        };
        
        let presentDate = localDate[0] + '-' + pad(localDate[1]) + '-' + pad(localDate[2]) + ' ' + pad(localDate[3]) + ':' + pad(localDate[4]) + ':' + pad(localDate[5]);
        return presentDate;
    })(localDate);

    return presentDate;
}