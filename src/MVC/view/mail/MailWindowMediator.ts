/**
 * 界面单元PetWindow对应的界面介质PetWindowMediator，主要业务逻辑如下：
 * 1、订阅数据源事件
 * 2、订阅界面事件
 * 3、收到界面事件，发送网络报文以获取远程数据
 * 4、收到远程数据，将其保存到数据仓库，同时触发数据源事件，引发界面单元Render
 * 
 * @note 所有的界面介质名称，都必须在ViewerName中登记，例如本例中的ViewerName.PetWindowMediator
 */
class MailWindowMediator extends puremvc.Mediator implements puremvc.IMediator {
    /**
     * 和指定UI建立关联，为UI上的控件订阅界面事件，并提供对应的响应函数
     */
    public constructor(viewComponent: any) {
        super(ViewerName.MailWindowMediator, viewComponent);
        // 更新页面
        this.RegisterDataSourceFun();
    }

    /**
     * 订阅和数据仓库相关的事件，当数据更新时自动刷新界面
     */
    public RegisterDataSourceFun(){
        this.page.RegisterDataSource([
            CommandList.M_DAT_MailList,
        ]); 
    }

    /**
     * 在这里书写所有需要订阅的消息
     */
    public listNotificationInterests(): Array<any> {
        return [
            CommandList.M_CMD_UiOpened_Mail,
        ]; 
    }

    /**
     * 在这里处理所有订阅的消息
     */
    public handleNotification(notification: puremvc.INotification): void {
        switch (notification.getName()) {
            case CommandList.M_CMD_UiOpened_Mail:
                //3、发送网络报文以获取远程数据
                FacadeApp.fetchData([CommandList.M_NET_Mail, "&oper=3&page=1&pageSize=30"], [data=>{
                    FacadeApp.dispatchAction(CommandList.M_DAT_MailList, data['data']);
                    if(data["code"] != FacadeApp.SuccessCode) UIPage.inst(UIPage).ShowPrompt().ShowWindow(FacadeApp._errorCodeSet[data["code"]]);
                }]);
                break;
        }
    }

    /**
     * 返回和界面介质相关联的界面单元
     */
    public get page(): MailWindow {
        return <MailWindow><any>(this.viewComponent);
    }
}
