/**
 * 复合信息标志位管理类
 * 使用先前的持久化字段创建该对象，进行相应的检测判断、置位/复位操作，最后取出最终值进行持久化
 */
class Indicator{
  /**
   * 通过持久化字段初始化对象
   *
   * @param val
   * @private
   */
  constructor(val){
    this._indecate = val;
  }
  private _indecate: any;

  /**
   * 获取当前复合标志的值，以进行持久化
   *
   * @returns {*}
   */
  get indecate() {
    return this._indecate;
  }

  /**
   * 重置标志位
   *
   * @param val
   */
  unSet(val){
    this._indecate = this._indecate & ~val;
    return this;
  }

  set(val){
    this._indecate |= val;
    return this;
  }

  /**
   * 检测当前值
   *
   * @param val
   * @returns {boolean}
   */
  check(val){
    return (this.indecate & val) == val;
  }

  
  static getChecker(status){
    return val => {
      return Indicator.getInstance(status).check(val);
    }
  }

  static getInstance(status){
    return new Indicator(status);
  }
}
