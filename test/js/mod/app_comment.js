define('app_comment',['jqmobi', 'mTips', 'login', 'JSP'],function($, tips, loginMod, JSP){
	var loading = $( '#div_waiting' );
	var userInfo = JSP.userInfo;
	var cmtType = 0;
	var req = function(data, successcb, errorcb, completecb) {
		$.ajax({
			url: 'http://infoapp.3g.qq.com/g/s?aid=cmt_touch_api' + '&callback=?&' + $.param(data || {}),
			cache: false,
			type: 'GET',
			dataType: 'json',
			data: null,
			success: successcb,
			error: errorcb,
			complete: completecb
		});
	};
	var comment = function(opt) {
		this._init(opt);
	};
	comment.prototype = {
		_init: function(opt) {
			this.obj = opt.obj || null;
			this.callbacks = opt.callbacks || {};
			this.pkuName = opt.pkuName || "";
			this.pn = 1;
			this.showAjaxData = opt.showAjaxData || null;
			this.setId(opt.id);
			var html = '<div class="infoapp-comments"><div class="comment-box">';
			html += '<div class="textarea"> <textarea class="cmt_text" placeholder="说说我的旅行"></textarea></div> <div class="sub"><span class="total">已有 <em class="comment-count">-</em> 条评论</span><a class="submit comment-sub">发表</a>  </div>';
			html += ' </div><section class="comments-main" style="margin-bottom:20px;"><dl class="commts-list cmt-dl commt-list"></dl></section><div style="display:none" class="link-more"><a>查看更多</a>';
			html += '</div>';
			$(this.obj).html(html);
			this._bindClick();
		},
		// 重设评论id
		setId: function(id, ajaxData) {
			this.cmtId = id;
			if (ajaxData) {
				this.showAjaxData = ajaxData;
			}
		},
		//拉取最新评论
		update: function() {
			var _this = this;
			if (!this.showAjaxData) {
				var ajaxData = {
					dt: "cmtLst",
					cmtId: _this.cmtId,
					pn: 1,
					pkuName: _this.pkuName,
					cmtType: cmtType,
					sid: JSP.userInfo.sid
				};
			} else {
				var ajaxData = this.showAjaxData;
			}
			if (!_this.cmtId) {
				console.log('error: no comment_id found!');
			}
			loading.show();
			req(ajaxData, function(data) {
				var cmtLst = data.cmtLst;
				var curClass = "ramdom_div" + Math.random();
				_this.clean();
				_this.obj.find('.comment-count').html(cmtLst.trc + '' || '');
				var dlElment = $(_this.obj).find('section.comments-main');
				if (cmtLst.trc == 0) {
					dlElment.hide();
				} else {
					dlElment.show();
					dlElment.find("dl").html(_this._renderCmtList(data));
				}
				if (cmtLst.pn < cmtLst.pc) {
					_this.pn = (cmtLst.pn + 1);
					$(_this.obj).find('.link-more').show();
				} else {
					$(_this.obj).find('.link-more').hide();
				}
				_this.callbacks.update && _this.callbacks.update.call(this, data);
				loading.hide();

				//tool.doPv("imovie_comment_update");
			});
		},
		refresh: function() {
			this.update();
			this.callbacks.refresh && this.callbacks.refresh();
		},
		//查看更多
		catMore: function() {
			var _this = this;
			var ajaxData = {
				dt: "cmtLst",
				cmtId: _this.cmtId,
				pn: _this.pn,
				pkuName: _this.pkuName,
				cmtType: cmtType,
				sid: JSP.userInfo.sid
			};
			$(_this.obj).children("div").find(".link-more").html("<a class=\"more\"><span class=\"loading\"><em class=\"loading-em\"></em></span><span class=\"loading-color\">读取中</span></a>");
			req(ajaxData, function(data) {
				if (data.cmtLst.pn == data.cmtLst.pc) {
					$(_this.obj).children("div").find(".link-more").hide();
				} else {
					$(_this.obj).children("div").find(".link-more").html("<a>查看更多</a>");
				}
				$(_this.obj).children("div").find(".cmt-dl").append(_this._renderCmtList(data));
				_this.obj.find('.comment-count').html(data.cmtLst.trc);
				_this.pn = (data.cmtLst.pn + 1);
				if (_this.callbacks.catmore) {
					_this.callbacks.catmore();
				};
				//tool.doPv("imovie_comment_more");
			});
		},
		//渲染
		_renderCmtList: function(data) {
			var cmtLst = data.cmtLst || {};
			if (cmtLst.result != -1) {
				var curCmtLst = cmtLst.record;
				if (curCmtLst) {
					var HTML = "";
					for (var i = 0; i < curCmtLst.length; i++) {
						HTML += '<dt>' + curCmtLst[i]['usernick'] + '<time>' + curCmtLst[i]['date'] + '</time></dt>';
						HTML += '<dd>';
						if (curCmtLst[i].pcmtsnserl != "") {
							var tmpPcmtArr = curCmtLst[i].pcmtsnserl.split(",").reverse();
							var isClose = false;
							var c = 0;
							for (var j = 0; j < tmpPcmtArr.length; j++) {
								var curPcmtItem = cmtLst.parentcmts[tmpPcmtArr[j]];
								if (curPcmtItem) {
									if (c == 0) {
										HTML += '<div class="quote"><dl class="commts-list">'
										var isClose = true;
									}
									HTML += '<dt>' + curPcmtItem['usernick'] + '<time>' + curPcmtItem['date'] + '</time></dt>';

									var cla = curPcmtItem.shortcontent.substr(0, 3);
									var shortcontent = curPcmtItem.shortcontent;
									if (cla == "/G/") {
										HTML += '<dd><p class="Good">' + shortcontent.substr(3) + '</p>';
									} else if (cla == "/N/") {
										HTML += '<dd><p class="Normal">' + shortcontent.substr(3) + '</p>';
									} else if (cla == "/B/") {
										HTML += '<dd><p class="Bad">' + shortcontent.substr(3) + '</p>';
									} else {
										HTML += '<dd><p>' + shortcontent + '</p>';
									}

									//HTML +='<dd><p>'+curPcmtItem.shortcontent+'</p>';

									if (j == 0) {
										var spanHTML = '<em class="yt">原帖</em>';
									} else {
										var spanHTML = '<em>' + j + '楼</em>';
									}
									HTML += '<div class="bar" data-value="' + tmpPcmtArr[j] + '"> <a v="' + curPcmtItem.digi + '" class="digi">顶  ' + curPcmtItem.digi + '</a><span class="user">' + spanHTML + '</span> </div>'
									HTML += '</dd>';
									c++;
								}

							}
							if (isClose) {
								HTML += '</dl></div>';
							}
						}
						var shortcontent = curCmtLst[i].shortcontent;
							HTML += '<p>' + shortcontent + '</p>';
						//HTML +='<p>'+curCmtLst[i].shortcontent+'</p>'
						HTML += '<div class="bar" data-value="' + curCmtLst[i].cmtsn + '"> <a v="' + curCmtLst[i].digi + '" class="digi">顶  ' + curCmtLst[i].digi + '</a><a class="relpy_btn">回复</a> </div>'
						HTML += '</dd>';
					}
				}
			}
			return HTML;
		},
		//写评论
		_doCmt: function() {
			var _this = this;
			//var text = decodeURIComponent(this.obj.find(".cmt_text").val());
			var text = this.obj.find(".cmt_text").val();
			// var tdObj = $("#comment_div_td").find(".vote-link");
			var tdClass = "";
			/*
			if (tdObj.hasClass("Good")) {
				text = "/G/" + text;
				tdClass = "Good";
			} else if (tdObj.hasClass("Normal")) {
				text = "/N/" + text;
				tdClass = "Normal";
			} else if (tdObj.hasClass("Bad")) {
				text = "/B/" + text;
				tdClass = "Bad";
			};
			*/
			var ajaxData = {
				dt: "cmtOp",
				cmtId: _this.cmtId,
				comment: text,
				pkuName: _this.pkuName,
				cmtType: cmtType,
				sid: JSP.userInfo.sid

			};
			loading.show();
			req(ajaxData, function(data) {
				var cmtOp = data.cmtOp;
				if (cmtOp.result == 0) {
					var insertHTML = "";
					insertHTML += '<dt>我<time>刚刚</time></dt>';
					insertHTML += '<dd>';
					if (tdClass != "") {
						insertHTML += '<p class="' + tdClass + '">' + text.substr(3) + '</p>'
					} else {
						insertHTML += '<p>' + text + '</p>'
					}

					insertHTML += '<div class="bar" data-value="' + cmtOp.cmtsn + '"> <a v="0" class="digi">顶</a><a class="relpy_btn">回复</a> </div>'
					insertHTML += '</dd>';
					tips.show("操作成功");
					$(_this.obj).find(".comments-main").show();
					$(_this.obj).find(".cmt-dl").prepend(insertHTML);
					_this.obj.find(".cmt_text").val('');
					if (_this.callbacks.post) {
						_this.callbacks.post();
					}
					// tdObj.attr("class", "vote-link");
					// tool.doPv("imovie_comment_write");
				} else if (cmtOp.result == "-1") {
					if (cmtOp.msg) {
						tips.show(cmtOp.msg);
					} else {
						tips.show("系统繁忙，请重试");
					}
				}
				loading.hide();


			});
		},
		//顶操作
		_doDigi: function(node) {
			var __self = this;
			var ag1 = node.data("value");
			var ajaxData = {
				dt: "cmtOp",
				cmtId: __self.cmtId,
				op: "digi",
				cmtsn: ag1,
				pkuName: __self.pkuName,
				cmtType: cmtType,
				sid: JSP.userInfo.sid
			}
			req(ajaxData, function(data) {
				var digi = node.find('.digi');
				var nowdigi = parseInt(digi.attr('v')) + 1;
				var cmtOp = data.cmtOp;
				if (cmtOp.result == 0) {
					tips.show('操作成功');
					digi.html("顶  " + nowdigi);
					digi.attr('v', nowdigi);
					// tool.doPv("imovie_comment_digi");
				} else if (cmtOp.result == -1) {
					tips.show(cmtOp.msg);
				} else {
					tips.show("系统繁忙，请重试");
				};

			})
		},
		//写回复
		_doReply: function(node) {
			var _this = this;
			var ag1 = $(node).siblings(".bar").data("value");
			var text = node.find("textarea").val();
			var ajaxData = {
				dt: "cmtOp",
				cmtId: _this.cmtId,
				pcmtsn: ag1,
				comment: text,
				pkuName: _this.pkuName,
				cmtType: cmtType,
				sid: JSP.userInfo.sid
			};
			loading.show();
			req(ajaxData, function(data) {
				if (data.cmtOp.result == 0) {
					tips.show("回复成功");
					$(node).find("textarea").val("");
					$(node).find("dl").append("<dt><time>刚刚</time>我</dt><dd><p>" + text + "</p></dd>");
					if (_this.callbacks.reply) {
						_this.callbacks.reply();
					}
					// tool.doPv("imovie_comment_reply");
				} else if (data.cmtOp.result == '-10') {
					loginMod.login(function(data) {
						// tool.loginCb(data)
						_this._doReply(node);
					});
				} else {
					tips.show("系统繁忙，请重试");
				}
				loading.hide();

			})
		},
		//打开/关闭 回复框
		_toggleReplyDialog: function(curTarget) {
			var _this = this;
			var replyNode = $(curTarget).children(".reply");
			if (replyNode.length == 0) {
				$(curTarget).append(_this._getReplyDialog());
				replyNode = $(curTarget).children(".reply");
				replyNode.data("isopen", "true");
				if (_this.callbacks.replyopen) {
					_this.callbacks.replyopen();
				}
			} else {
				if (replyNode.data("isopen") == "false") {
					replyNode.show().data("isopen", "true");
					_this.callbacks.replyopen && _this.callbacks.replyopen();
				} else {
					replyNode.hide().data("isopen", "false");
					_this.callbacks.replyclose && _this.callbacks.replyclose();
				}
			}
		},
		//得到回复框
		_getReplyDialog: function() {
			var HTML = '<div class="reply"><div class="textarea">'
			HTML += '<textarea></textarea>'
			HTML += '</div>'
			HTML += '<div class="sub"> <a class="cancel">取消</a> <a class="sumbit reply-sub">确定</a> </div>';
			HTML += '<dl class="commts-list"></dl>';
			HTML += '</div>'
			return HTML;
		},
		//绑定事件
		_bindClick: function() {
			var _this = this;
			//顶操作
			$(_this.obj).delegate(".digi", "click", function() {
				_this._doDigi($(this).parent());
			});
			//查看更多
			$(_this.obj).delegate(".link-more", "click", function() {
				_this.catMore();
			});
			//写评论
			$(_this.obj).delegate(".comment-sub", "click", function() {
				var text = _this.obj.find(".cmt_text").val();
				if (!text) {
					tips.show("请输入评论内容!");
					return;
				}

				if( JSP.userInfo.isLogin ) {
					_this._doCmt();
					return;
				}

                loginMod.login( function() {
					_this._doCmt();
                } );
			});
			//点击回复按钮
			$(_this.obj).delegate(".relpy_btn", "click", function() {
				_this._toggleReplyDialog($(this).parent().parent());
			});
			//点击取消按钮
			$(_this.obj).delegate(".cancel", "click", function() {
				_this._toggleReplyDialog($(this).parent().parent().parent());
			});
			//写回复
			$(_this.obj).delegate(".reply-sub", "click", function() {
				_this._doReply($(this).parent().parent());
			});
			_this.callbacks.eventsbinded && _this.callbacks.eventsbinded();
		},
		// 清空评论
		clean: function() {
			$(this.obj).find('section.comments-main').html("<dl class=\"commts-list cmt-dl commt-list\"></dl>");
			$(this.obj).find('em.comment-count').html('-');
			$(this.obj).find('.link-more').hide();
		}
	};
	return {
		create: function(opt) {
			return new comment(opt);
		}
	};
})