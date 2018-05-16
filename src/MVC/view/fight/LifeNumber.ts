/**
 * 血量数值
 */
class LifeNumber extends eui.Component implements eui.UIComponent {
	/**
	 * 血量图片文本
	 */
	public _lifeBitmapLabel: eui.BitmapLabel;

	/**
	 * 构造方法
	 */
	public constructor($value) {
		super();
		$value ? this.skinName = "resource/game_skins/monster/PetLifeNumber.exml" : this.skinName = "resource/game_skins/monster/LifeNumber.exml";
	}

	/**
	 * 设置数值
	 */
	public set number($value) {
		this._lifeBitmapLabel.text = $value;
	}
}