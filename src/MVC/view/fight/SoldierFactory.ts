/**
 * 战斗模块 - 战士类工厂
 * 
 * @note 如果将父类和子类声明到不同的独立文件中，编译执行时容易引发类型定义错误，合并到同一个文件中错误消失，原因不明 2017.3.6
 */
namespace SoldierManage{
    export class SoldierConfigInfo{
        /**
         * 编号
         */
        public uid : Number = 0;
        /**
         * 类型
         */
        public utype: SoldierType = SoldierType.hero;

        public constructor(_type: SoldierType, _id: Number){
            this.uid = _id;
            this.utype = _type;
        }
    }

	/**
	 * 作战单元创建工厂
	 */
	export class SoldierFactory {
		private static _instance: SoldierFactory;
		public static get inst(): SoldierFactory {
			if (!this._instance) {
				this._instance = new SoldierFactory();
			}
			return this._instance;
		}

		public newSildier(unitConfig: SoldierConfigInfo): Soldier {
            let ret:Soldier = null;
            switch(unitConfig.utype){
                case SoldierType.hero:
                    ret = new RoleSoldier();
                    break;
                case SoldierType.pet:
                    ret = new PetSoldier();
                    break;
                // case SoldierType.ghost:
                    // ret = new CardSoldier();
                    // break;
                case SoldierType.monster:
                case SoldierType.boss:
                    ret = new MonsterSoldier();
                    break;
                default:
                    ret = new Soldier();
                    break;
            }
            ret.unitType = unitConfig.utype;
            return ret;
		}
	}
}