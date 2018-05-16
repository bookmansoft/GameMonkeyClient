/**
 * 文本管理
 */
class TextManager{
    /**
	 * 时间格式化 放回文本
	 * @param time          时间
	 */
    public static TimeFormat(time: number): string{
        var timeString: string = "";
        if (time < 100){
            timeString = time.toString() + "s";
        }
        else{
            var h: number = Math.floor(time / 60 / 60);
            var m: number = Math.floor(time % 3600 / 60);
            var s: number = time % 60;
            var hStr: string = h > 0? h.toString() : "";
            var mStr: string = m > 9? m.toString() : "0" + m.toString();
            var sStr: string = s > 9? s.toString() : "0" + s.toString();
            if (h > 0){
                timeString = hStr + ":" + mStr + ":" + sStr;
            }
            else{
                timeString = mStr + ":" + sStr;
            }
        }
        return timeString;
    }
}