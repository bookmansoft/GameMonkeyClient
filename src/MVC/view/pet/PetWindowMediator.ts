/**
 * 界面单元PetWindow对应的界面介质PetWindowMediator，主要业务逻辑如下：
 * 1、订阅数据源事件
 * 2、订阅界面事件
 * 3、收到界面事件，发送网络报文以获取远程数据
 * 4、收到远程数据，将其保存到数据仓库，同时触发数据源事件，引发界面单元Render
 * 
 * @note 所有的界面介质名称，都必须在ViewerName中登记，例如本例中的ViewerName.PetWindowMediator
 */
class PetWindowMediator extends puremvc.Mediator implements puremvc.IMediator {
    /**
     * 和指定UI建立关联，为UI上的控件订阅界面事件，并提供对应的响应函数
     */
    public constructor(viewComponent: any) {
        super(ViewerName.PetWindowMediator, viewComponent);
        // 更新页面
        this.RegisterDataSourceFun();
    }

    /**
     * 订阅和数据仓库相关的事件，当数据更新时自动刷新界面
     */
    public RegisterDataSourceFun(){
        this.page.RegisterDataSource([
            CommandList.M_DAT_PetList,
            CommandList.M_DAT_Status_PowerClick,
        ]); 
    }

    /**
     * 在这里书写所有需要订阅的消息
     */
    public listNotificationInterests(): Array<any> {
        return [
            CommandList.M_CMD_UiOpened_Pet,
        ]; 
    }

    /**
     * 在这里处理所有订阅的消息
     */
    public handleNotification(notification: puremvc.INotification): void {
        switch (notification.getName()) {
            case CommandList.M_CMD_UiOpened_Pet:
                //3、发送网络报文以获取远程数据
                FacadeApp.fetchData([CommandList.M_NET_PetNum, "&oper=1&pm=0&id=0"], [data=>{
                    //4、收到远程数据，将其保存到数据仓库，同时触发数据源事件，引发界面单元Render
                    FacadeApp.dispatchAction(CommandList.M_DAT_PetList, data['data']);
                    if(data["code"] != FacadeApp.SuccessCode) UIPage.inst(UIPage).ShowPrompt().ShowWindow(FacadeApp._errorCodeSet[data["code"]]);
                }]);
                if(FacadeApp.read(CommandList.Re_Status).guideId == 2) GuideWindow.inst(GuideWindow).GuideFinish(FacadeApp.read(CommandList.Re_Status).guideId);//新手引导第2步
                //注:启动时已经取过宠物列表了，此处之所以没有仅触发事件（如下行代码所示），而是重新取网络数据，是因为用户有可能在其他界面上购买了新的宠物。此处有优化空间
                //FacadeApp.dispatchAction(CommandList.M_AT_PETLIST); //触发界面Render
                break;
        }
    }

    /**
     * 返回和界面介质相关联的界面单元
     */
    public get page(): PetWindow {
        return <PetWindow><any>(this.viewComponent);
    }
}
