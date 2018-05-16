/**
 * 怪物血条
 */
class MonsterLifeBar extends eui.ProgressBar implements  eui.UIComponent {
	/**
	 * 构造方法
	 */
	public constructor() {
		super();
		this.skinName = "resource/game_skins/monster/MonsterLifeBar.exml";
	}
}