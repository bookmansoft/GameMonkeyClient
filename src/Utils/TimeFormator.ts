/**
 * 倒计时管理对象
 */
class ChangeLabelValue{
  /**
   * 构造函数
   * @self 容器对象
   * @_onUpdate 更新回调
   * @_callback 结束回掉
   * @_interval 更新周期 默认1秒
   */
  constructor(self, _onUpdate, _callback, _interval=1){
	  this.onUpdate = _onUpdate;
    this.parent = self;
    this.callback = _callback;
    this.timer = {};
    this.interval = _interval;
    this.tick();
  }
  private parent;
  private callback;
  private timer;
  private pointOfTimer;
  private onUpdate;
  private interval = 1;

  tick(){
    if(this.timer){
      Object.keys(this.timer).map(id=>{
        if(this.timer[id].val <= 0.001){/* 为避免浮点数带来的精度问题，不要和0比对 */
          if(this.timer[id].status == 1){
            this.timer[id].status = 0;
    			  this.onUpdate(id);
            this.callback(id);
          }
        }
        else if(this.timer[id].val > 0){
          this.timer[id].val -= this.interval;
    		  this.onUpdate(id);
        }
      });
      this.pointOfTimer = setTimeout(()=>{
        this.tick();
      }, this.interval*1000);
    }
  }

  destory(){
    if(this.pointOfTimer > 0){
      clearTimeout(this.pointOfTimer);
      this.pointOfTimer = 0;
    }
  }

  getValue(id){
    if(this.timer[id]){
      return TimeFormator.ToTimeFormat(this.timer[id].val);
    }
    else{
      return TimeFormator.ToTimeFormat(0);
    }
  }
  getOriValue(id){
    return this.timer[id].val;
  }

  setValue(id, val){
    if(val > 0){
      this.timer[id] = {val: val, status: 1};
    }
    else{
      if(this.timer.hasOwnProperty(id)){
		    this.onUpdate(id);
      }
      this.timer[id] = {val: 0, status: 0};
    }
  }
}

class TimeFormator {
	public static ToTimeFormat(lt:number){
		let $h = Math.floor(lt / 3600);
		let $m = Math.floor((lt % 3600) / 60);
		let $s = Math.floor(lt % 60);
		return this.AddPad($h) + ':' + this.AddPad($m) + ':' + this.AddPad($s);
	}
	public static AddPad(va){
		return va < 10 ? '0' + va.toString() : va.toString();
	}
}