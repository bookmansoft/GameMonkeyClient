/**
 * 战斗模块 - 战士类工厂
 * 
 * @note 如果将父类和子类声明到不同的独立文件中，编译执行时容易引发类型定义错误，合并到同一个文件中错误消失，原因不明 2017.3.6
 */
namespace PVPManager{
    export class SoldierConfigInfo{
        /**
         * 角色编号
         */
        public roleid : number = 0;
        /**
         * 类型
         */
        public utype: SoldierType = SoldierType.pvpMineHero;
        /**
         * 位置
         */
        public site: number = 2;
        /**
		 * 是否是我方战队
		 */
		public isMineArmy: boolean = false;
        /**
		 * 队伍编号
		 */
		public uid: number = 0;

        public constructor(_type: SoldierType, _roleid: number, _site: number, _uid: number){
            this.roleid = _roleid;
            this.utype = _type;
            this.site = _site;
            this.uid = _uid;
            this.isMineArmy = this.uid == PVPFightManager.GetInstance().armyOfMine._uid ? true : false;
            
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

		public newSildier(unitConfig: SoldierConfigInfo): PVPSoldier {
            let ret:PVPSoldier = null;
            switch(unitConfig.utype){
                case SoldierType.pvpMineHero:
                    ret = new PVPRole(unitConfig.utype,unitConfig.site,unitConfig.roleid,unitConfig.uid);
                    break;
                case SoldierType.pvpEnemyHero:
                    ret = new PVPRole(unitConfig.utype,unitConfig.site,unitConfig.roleid,unitConfig.uid);
                    break;
                case SoldierType.pvpMinePet:
                    ret = new PVPRole(unitConfig.utype,unitConfig.site,unitConfig.roleid,unitConfig.uid);
                    break;
                case SoldierType.pvpEnemyPet:
                    ret = new PVPRole(unitConfig.utype,unitConfig.site,unitConfig.roleid,unitConfig.uid);
                    break;
                default:
                    ret = new PVPSoldier();
                    break;
            }
            // ret.unitType = unitConfig.utype;
            // ret._uid = unitConfig.uid;
            // ret.isMineArmy = unitConfig.uid == 1? true : false;
            // ret.site = unitConfig.site;
            // ret._roleid = unitConfig.roleid;
            return ret;
		}
	}
}