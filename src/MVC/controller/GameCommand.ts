/**
 * Control，大致相当于Action的作用，分发调用Proxy，相当于分发调用Reducer
 */
class GameCommand extends puremvc.SimpleCommand implements puremvc.ICommand {

    public constructor() {
        super();
    }
    public static NAME: string = "GameCommand";

    /**
     * 注册消息
     */
    public register(): void {
        this.facade.registerCommand(CommandList.M_CMD_ZhenPing, GameCommand);
        this.facade.registerCommand(CommandList.M_CMD_CHANGE, GameCommand);
    }

    public execute(notification: puremvc.INotification): void {
        switch (notification.getName()) {
            case CommandList.M_CMD_CHANGE: {
                var data: any = notification.getBody();
                var appMediator:MainMediator = <MainMediator><any>this.facade.retrieveMediator(ViewerName.MainMediator);
                if (data == 1){
                    appMediator.main.enterStartScreen();
                }
                else{
                    appMediator.main.enterGameScreen();
                }
                break;
            }
            case CommandList.M_CMD_ZhenPing:{
                Main.Instance.creatZhenPingFun();                
                break;
            }
        }
    }
}