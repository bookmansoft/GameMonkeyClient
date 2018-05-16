/**
 * 和舞台对应的Mediator
 */
class BuddhaGuardMediator extends puremvc.Mediator implements puremvc.IMediator {
    /**
     * 和指定UI建立关联，为UI上的控件订阅界面事件，并提供对应的响应函数
     */
    public constructor(viewComponent: any) {
        super(ViewerName.BuddhaGuardMediator, viewComponent);

        this.main.RegisterDataSource([CommandList.M_DAT_TalismanList]);
    }

    /**
     * 在这里书写所有需要订阅的消息
     */
    public listNotificationInterests(): Array<any> {
        return [CommandList.M_CMD_UiOpened_Talisman];
    }

    /**
     * 在这里处理所有订阅的消息
     */
    public handleNotification(notification: puremvc.INotification): void {
        switch (notification.getName()) {
            case CommandList.M_CMD_UiOpened_Talisman:
                FacadeApp.dispatchAction(CommandList.M_DAT_TalismanList);
                break;
        }
    }

    /**
     * 返回关联的UI单元
     */
    public get main(): BuddhaGuardWindow {
        return <BuddhaGuardWindow><any>(this.viewComponent);
    }
}