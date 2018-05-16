// TypeScript file
class ControllerPrepCommand extends puremvc.SimpleCommand implements puremvc.ICommand {

    public constructor() {
        super();
    }
    public execute(notification: puremvc.INotification): void {
        //注册GameCommand命令管理器
        (new GameCommand()).register();

        //TODO：注册更多分类命令管理器
    }
}
