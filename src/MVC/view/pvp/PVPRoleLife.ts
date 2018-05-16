/**
 * 怪物血条
 */
class PVPRoleLife extends eui.ProgressBar implements  eui.UIComponent {
	/**
	 * 构造方法
	 */
	public constructor() {
		super();
		this.skinName="resource/game_skins/pvp/PVPRoleLifeSkins.exml";
	}

	/**
	 * 设置显示
	 */
	public upData(object: Object){
		this._curHealth = object["d"];
		let _maxHealth = object["dm"];
		let _damge = object["a"];
		this._curShiQi = object["h"];

		if(this._curHealth!=0){
			egret.Tween.get(this._healthIma).to({width:this.CurHealth/_maxHealth*this.MaxHealthWidth},100);
		}else{
			this._healthIma.width = this.CurHealth/_maxHealth*this.MaxHealthWidth;
		}

		this._damgeLabel.text = this.CurHealth.toString();
		egret.Tween.get(this._shiqiIma).to({width:this._curShiQi/100*this.MaxHealthWidth},100);
	}

	/**
	 * 创建buff图标
	 */
	public creatBuff($type: number){
		let _buffIma: eui.Image = new eui.Image;

		if($type == PVPManager.BattleBuffEnum.Poisoned){
			_buffIma.source = "buff_zhongdu_png";
		}
		else{
			_buffIma.source = "buff_gongjijian_png";
		}

		this.addChild(_buffIma);
		_buffIma.y = this._bg.y + this._bg.height + 3;
		_buffIma["type"] = $type;
		if(this._buffImaSet.length > 0){
			_buffIma.x = this._buffImaSet[this._buffImaSet.length - 1].x + _buffIma.width + 1;
		}else{
			_buffIma.x = 1;
		}
	}

	/**
	 * 更新buff排序
	 */
	private upDataBuffPosi(){
		for(let i=0; i<this._buffImaSet.length; i++){
			this._buffImaSet[i].x = 1 + i*(this._buffImaSet[i].width + 1);
		}
	}

	/**
	 * 移除buff
	 */
	public clearBuff($type: number){
		for(let i=0; i<this._buffImaSet.length; i++){
			if(this._buffImaSet[i]["type"] == $type){
				this._buffImaSet.splice(i,1);
			}
		}
		this.upDataBuffPosi();
	}

	/**
	 * 获取当前血量
	 */
	public get CurHealth(){
		return this._curHealth;
	}

	/**
	 * 获取当前士气
	 */
	public get CurShiQi(){
		return this._curShiQi;
	}


	/**
	 * 血条,士气条最大长度
	 */
	public get MaxHealthWidth(){
		return 105;
	}

	private _damgeLabel: eui.Label;						// 攻击文本
	private _healthIma: eui.Image;						// 血条图片
	private _shiqiIma: eui.Image;						// 士气图片
	private _bg: eui.Image;								// 背景
	// private _buffIma: eui.Image;						// buff图标

	private _buffImaSet: eui.Image[] = [];				// buff图标集合

	private _curHealth: number = 0;						// 当前血量
	private _curShiQi: number = 0;						// 当前士气
}