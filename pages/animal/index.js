var netUtil = require('/../../utils/netUtil.js')
var that;

// pages/group/index.js
var app = getApp();
Page({
    data:{
        currentTab:0,
        scrollTop:0,
        page:0,
        groupData:[],
        loading:true
    },
    onLoad: function (options) {
        var systemInfo = wx.getSystemInfoSync()
        this.setData({
            windowHeight: systemInfo.windowHeight
        })
    },
    onShow:function(){
        this.setCurrentData()
    },

    setCurrentData:function(){
        if(!this.data.loading){
            return false
        }

        this.setData({
            userInfo: app.globalData.userInfo
        })

        var self = this;
    },
    showGoodsDetail:function(e){
        var id = e.currentTarget.dataset.id;
        if(!id) return ;
        app.redirect('goods/detail',"gid="+id)
    },
    showGroupInfo:function(e){
        var id = e.currentTarget.dataset.id;
        app.redirect('group/detail',"id="+id)
    },
    showOrderInfo:function(e){
        var id = e.currentTarget.dataset.id;
        app.redirect('orders/detail',"oid="+id)

    },
    // 滑动切换tab
    bindChange: function( e ) {
        this.data.page = 0
        this.data.groupData=[]
        this.data.loading = true
        this.data.currentTab = e.detail.current
        this.setCurrentData()
        this.setData({
            loading:true,
            groupList:[],
            currentTab: this.data.currentTab
        })
    },
    // 点击tab切换
    swichNav: function( e ) {
        if( this.data.currentTab == e.currentTarget.dataset.current ) return;
        this.data.currentTab = e.currentTarget.dataset.current
        this.setData({
            currentTab: this.data.currentTab
        })
    },
    scrolltolower:function(){
        ++this.data.page
        this.setCurrentData()
    }
})