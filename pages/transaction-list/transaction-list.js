var netUtil = require('/../../utils/netUtil.js')
var app = getApp()
var that;
Page({

	data: {
		scrollHeight: 0,
		page: 1,
		pagesize: 8,
		needLoadMore: true,
		searchWord: '',
		transactions: [],
		scrollViewHeight:null,  //1200
		//如果是点击卡片进来的情况，这个值不为空
		userCardId:null,
		startDate : null,
		endDate : null
	},

	onLoad: function(options) {
		
		var userCardId = options.userCardId;
		
		var scrollViewHeight = 1091;
		if(userCardId != null && userCardId != '') {
			scrollViewHeight = 1200;
		}
		this.setData({
			userCardId :userCardId,
			scrollViewHeight : scrollViewHeight
		});
		
		var that = this;
		app.getUserOpedId(that.loadmore);
		wx.getSystemInfo({
			success: function(res) {
				console.info(res.windowHeight);
				that.setData({
					scrollHeight: res.windowHeight
				});
			}
		});
	},

	onShow: function() {

	},
	
	bindDateChange : function (e) {
		console.log(e.detail.value);
		/*this.setData({
			searchWord: e.detail.value
		});*/
	
		this.setData({
			startDate: e.detail.value,
			endDate:e.detail.value,			 
		    page :1,
			transactions :[],
			needLoadMore :true
		});
		
		this.loadmore();
	},
	
	search: function() {

			this.setData({
				  //先回复数据
					page :1,
					transactions :[],
					needLoadMore :true,
					startDate : null,
					endDate : null
			});
			
			this.loadmore();
	},

	//搜索关键词 键盘输入时间
	searchWordInput: function(e) {
		this.setData({
			searchWord: e.detail.value
		})
	},
	
	 onPullDownRefresh: function () {

        console.log("onPullDownRefresh")
        this.setData({
            page: 1,
            transactions: [],
            needLoadMore: true,
			startDate : null,
			endDate : null,
			searchWord: ''
        });
        var that = this ;
        wx.stopPullDownRefresh();
        that.loadmore();
       
    },

	loadmore: function() {
		console.log("loadmore start");
		var that = this;
		if(!that.data.needLoadMore) {
			return;
		}

		//请求参数
		var params = {
			service: 'xiche.transaction.list',
			search_text: this.data.searchWord,
			page: this.data.page,
			pagesize: this.data.pagesize,
			begin_date : this.data.startDate,
			end_date : this.data.endDate,
			user_card_id : this.data.userCardId
		};

		netUtil.buildRequest(that, '/xicatcard/api', params, {
			onPre: function() {
				console.log("page:" + that.data.page);
				netUtil.showLoadingDialog(that);
			},
			onSuccess: function(data) {
				netUtil.hideLoadingDialog(that);
				if(data.transactions != undefined && data.transactions.length > 0) {
					console.log("page:" + that.data.page + "|transactions.length:" + data.transactions.length)
					if(that.data.transactions != undefined && that.data.transactions.length > 0) {
						for(var i = 0; i < data.transactions.length; i++) {
							that.data.transactions.push(data.transactions[i])
						}
					} else {
						that.data.transactions = data.transactions;
					}
					that.setData({
						transactions: that.data.transactions,
						page: that.data.page + 1
					});
				}
				if(data.transactions == undefined || data.transactions.length < that.data.pagesize) {
					that.setData({
						needLoadMore: false
					});
				}
			},
			onError: function(msgCanShow, code, hiddenMsg) {
        		console.log("fail");
				netUtil.hideLoadingDialog(that);
				netUtil.showAlertDialog("提示", msgCanShow, false, "确定", null, null);

			},
		}).send();
	}
})