/**
 * 角色管理器
 */
class UnitManager {
	/**
	 * 初始化
	 */
	public static Init(){
		FacadeApp.fetchData([CommandList.M_NET_STATUS], [data=>{ //接收玩家初始化消息
			if (data["code"] == FacadeApp.SuccessCode){
				FacadeApp.dispatchAction(CommandList.M_AT_STATUSLIST, data['data']);

				let id: number = parseInt(UnitManager.PlayID);
				let name: string = "猴子";
				let token: number = data["data"]["diamond"];
				let money: Digit = new Digit([data["data"]["money"]["base"], data["data"]["money"]["power"]]);

				UnitManager._player = new Player(id, name);
				FacadeApp.Notify(CommandList.M_CMD_CHANGE, 2);
			}else{
				UIPage.inst(UIPage).ShowPrompt().ShowWindow(FacadeApp._errorCodeSet[data["code"]]);
			}
		}]);
	}

	/**
	 * 玩家
	 */
	public static get Player(): Player{
		return UnitManager._player;
	}
	private static _player : Player;

	/**
	 * 玩家ID
	 */
	public static get PlayID(): string{
		let id:string = GameConfigOfRuntime.IsDebug ? GameConfigOfRuntime.TestUserId : egret.localStorage.getItem("playkey");
        if (id == null || id == null){
            id = Math.floor((Math.random() + 1) * 10000000000).toString();
            egret.localStorage.setItem("playkey", id);
        }
        return id;
	}
}