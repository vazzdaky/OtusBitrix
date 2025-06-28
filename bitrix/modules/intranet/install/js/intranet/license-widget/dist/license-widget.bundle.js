this.BX=this.BX||{},function(e,t,i,s,n){"use strict";class a extends t.EventEmitter{constructor(e){super(),this.cache=new s.Cache.MemoryCache,this.setOptions(e),this.setEventNamespace("BX.Intranet.LicenseWidget.Content")}setOptions(e){return this.cache.set("options",e),this}getOptions(){return this.cache.get("options",{})}getLayout(){throw new Error("Must be implemented in a child class")}getConfig(){return{html:this.getLayout(),minHeight:"58px"}}}let r,o,l,c,d,g,p=e=>e;class h extends a{getConfig(){return{html:this.getLayout(),minHeight:this.getOptions().isSmall?"86px":"55px"}}getLayout(){return this.cache.remember("layout",()=>s.Tag.render(r||(r=p`
				<div data-id="${0}" class="license-widget-item license-widget-item--secondary ${0}">
					<div class="license-widget-inner ${0}">
						<div class="license-widget-content">
							${0}
							<div class="license-widget-item-content">
								${0}
								${0}
							</div>
						</div>
						${0}
					</div>
				</div>
			`),this.getLayoutId(),this.getMainClass(),this.getOptions().isSmall?"--column":"",this.getIcon(),this.getTitle(),this.getDescription(),this.getButton()))}getLayoutId(){return"license-widget-block-market"}getTitle(){return this.cache.remember("title",()=>s.Tag.render(o||(o=p`
				<div class="license-widget-item-name">
					<span>
						${0}
					</span>
				</div>
			`),this.getOptions().title))}getIcon(){return this.cache.remember("icon",()=>s.Tag.render(l||(l=p`
				<div class="license-widget-item-icon license-widget-item-icon--mp"/>
			`)))}getDescription(){return this.cache.remember("description",()=>this.getOptions().isPaid||this.getOptions().isDemo?this.getReminderMessage():this.getDescriptionLink())}getMainClass(){return this.getOptions().isExpired||this.getOptions().isAlmostExpired?"--market-expired":this.getOptions().isPaid||this.getOptions().isDemo?"--market-active":"--market-default"}getReminderMessage(){return this.cache.remember("reminder-message",()=>s.Tag.render(c||(c=p`
				<div class="license-widget-item-info">
					<span class="license-widget-item-info-text">
						${0}
					</span>
				</div>
			`),this.getOptions().messages.remainder))}getDescriptionLink(){return this.cache.remember("description-link",()=>s.Tag.render(d||(d=p`
				<div class="license-widget-item-link">
					<span class="license-widget-item-link-text" onclick="${0}">
						${0}
					</span>
				</div>
			`),()=>{i.FeaturePromotersRegistry.getPromoter({code:this.getOptions().description.landingCode}).show()},this.getOptions().description.text))}getButton(){return this.cache.remember("button",()=>s.Tag.render(g||(g=p`
				<a onclick="${0}" href="${0}" class="license-widget-item-btn" target="_blank">
					${0}
				</a>
			`),()=>{t.EventEmitter.emit(t.EventEmitter.GLOBAL_TARGET,"BX.Intranet.LicenseWidget.Popup:openChild")},this.getOptions().button.link,this.getOptions().button.text))}}let m,b,u,v,w,O=e=>e;const L=Symbol("baas widget");var P=babelHelpers.classPrivateFieldLooseKey("showBaasWidget");class y extends h{constructor(...e){super(...e),Object.defineProperty(this,P,{value:B})}getConfig(){return{html:this.getLayout(),minHeight:this.getOptions().isSmall?"86px":"55px"}}getTitle(){return this.cache.remember("title",()=>s.Tag.render(m||(m=O`
				<div class="license-widget-item-name">
					<span>
						${0}
					</span>
				</div>
			`),this.getOptions().title))}getDescription(){return this.getOptions().isActive?this.getReminderMessage():this.getDescriptionLink()}getDescriptionLink(){return this.cache.remember("description-link",()=>s.Tag.render(b||(b=O`
				<div class="license-widget-item-link">
					<span class="license-widget-item-link-text" onclick="${0}">
						${0}
					</span>
				</div>
			`),()=>{i.FeaturePromotersRegistry.getPromoter({code:this.getOptions().description.landingCode}).show()},this.getOptions().description.text))}getReminderMessage(){return this.cache.remember("reminder-message",()=>{const e=s.Tag.render(u||(u=O`
				<div class="license-widget-item-link" onclick="${0}">
					<span class="license-widget-item-link-text --active">
						${0}
					</span>
				</div>
			`),babelHelpers.classPrivateFieldLooseBase(this,P)[P].bind(this),this.getOptions().messages.remainder);return BX.PULL&&s.Extension.getSettings("baas.store").pull&&(BX.PULL.extendWatch(s.Extension.getSettings("baas.store").pull.channelName),t.EventEmitter.subscribe("onPullEvent-baas",t=>{const[i,s]=t.getData();"updateService"===i&&s.purchaseCount&&(e.querySelector('[data-bx-role="purchaseCount"]').innerText=s.purchaseCount)})),e})}getLayoutId(){return"license-widget-block-baas"}getButton(){return s.Tag.render(v||(v=O`
			<a class="license-widget-item-btn" onclick="${0}">
				${0}
			</a>
		`),babelHelpers.classPrivateFieldLooseBase(this,P)[P].bind(this),this.getOptions().button.text)}getIcon(){return this.cache.remember("icon",()=>s.Tag.render(w||(w=O`
				<div class="license-widget-item-icon license-widget-item-icon--baas"/>
			`)))}getMainClass(){return this.getOptions().isActive?"--baas-active":"--baas-default"}}function B(){s.Runtime.loadExtension(["baas.store"]).then(e=>{const i=e.Widget.getInstance();i[L]||i.subscribe("onClickBack",()=>{this.getOptions().licensePopup.show()}),i.bind(this.getOptions().licensePopupTarget,e.Analytics.CONTEXT_LICENSE_WIDGET).show(),t.EventEmitter.emit(t.EventEmitter.GLOBAL_TARGET,"BX.Intranet.LicenseWidget.Popup:openChild")})}let x,f,k,E,$,C,H,T,F,A=e=>e;class I extends a{constructor(e){super(e),this.setEventNamespace("BX.Bitrix24.LicenseWidget.Content.License")}getLayout(){return this.cache.remember("layout",()=>s.Tag.render(x||(x=A`
			<div data-id="license-widget-block-tariff"
				class="license-widget-item license-widget-item--main ${0}"
			>
				<div class="license-widget-inner ${0}">
					<div class="license-widget-content">
						${0}
						<div class="license-widget-item-content">
							<div class="license-widget-item-name">
								<span>${0}</span>
							</div>
							${0}
							${0}
							${0}
						</div>
					</div>
					${0}
				</div>
			</div>
			`),this.getOptions().isExpired||this.getOptions().isAlmostExpired?"license-widget-item--expired":"",this.getOptions().isDemo?"--demo":"",this.getMainIcon(),this.getOptions().name,this.getOptions().isExpired?this.getExpiredMessage():this.getRemainderMessage(),this.getOptions().isExpired&&this.getOptions().isAlmostBlocked?this.getBlockMessage():"",this.getOptions().isAlmostBlocked?"":this.getLink(),this.getOptions().button.isAvailable?this.getButton():""))}getMainIcon(){const e=s.Tag.render(f||(f=A`
			<div class="license-widget-item-icon"/>
		`));return this.getOptions().isAlmostExpired?s.Dom.addClass(e,"license-widget-item-icon--low"):this.getOptions().isExpired?s.Dom.addClass(e,"license-widget-item-icon--expired"):this.getOptions().isDemo?s.Dom.addClass(e,"license-widget-item-icon--demo"):s.Dom.addClass(e,"license-widget-item-icon--pro"),e}getButton(){if("POST"===this.getOptions().button.type){const e=()=>{document.querySelector("#renew-license-form").submit()};return s.Tag.render(k||(k=A`
				<button onclick="${0}" class="license-widget-item-btn ${0}">
					<form id="renew-license-form" action="${0}" method="post" target="_blank">
						<input name="license_key" value="${0}" hidden>
					</form>
					${0}
				</button>
			`),e,!this.getOptions().isDemo||this.getOptions().isAlmostExpired||this.getOptions().isExpired?"":"license-widget-item-btn--green",this.getOptions().button.link,this.getOptions().button.hashKey,this.getOptions().button.text)}return s.Tag.render(E||(E=A`
			<a href="${0}" target="_blank" class="license-widget-item-btn ${0}">
				${0}
			</a>
		`),this.getOptions().button.link,!this.getOptions().isDemo||this.getOptions().isAlmostExpired||this.getOptions().isExpired?"":"license-widget-item-btn--green",this.getOptions().button.text)}getExpiredMessage(){return this.cache.remember("expired-message",()=>s.Tag.render($||($=A`
				<div class="license-widget-item-expired-message">
					<span class="license-widget-item-info-text">
						${0}
					</span>
				</div>
			`),this.getOptions().messages.expired))}getBlockMessage(){return this.cache.remember("block-message",()=>s.Tag.render(C||(C=A`
				<div class="license-widget-item-expired-message --scanner-info">
					<span class="license-widget-item-info-text">
						${0}
					</span>
				</div>
			`),this.getOptions().messages.block))}getRemainderMessage(){return this.cache.remember("block-message",()=>this.getOptions().isExpired||this.getOptions().isAlmostExpired?s.Tag.render(H||(H=A`
					<div class="license-widget-item-expired-message --scanner-info">
						<span class="license-widget-item-info-text">
							${0}
						</span>
					</div>
				`),this.getOptions().messages.remainder):s.Tag.render(T||(T=A`
				<div class="license-widget-item-info">
					<span class="license-widget-item-info-text">
						${0}
					</span>
				</div>
			`),this.getOptions().messages.remainder))}getLink(){return s.Tag.render(F||(F=A`
			<a href="${0}" class="license-widget-item-link-text" target="_blank">
				${0}
			</a>
		`),this.getOptions().more.link,this.getOptions().more.text)}}let M,_,X=e=>e;class D extends a{constructor(e){super(e),this.setEventNamespace("BX.Bitrix24.LicenseWidget.Content.Orders")}getConfig(){return{html:this.getLayout(),minHeight:"50px"}}getLayout(){return this.cache.remember("layout",()=>s.Tag.render(M||(M=X`
				<div data-id="license-widget-block-orders" onclick="${0}" class="license-widget-item license-widget-item--secondary --pointer">
					<div class="license-widget-inner">
						<div class="license-widget-content">
							<div class="license-widget-item-icon license-widget-item-icon--partner"></div>
							<div class="license-widget-item-content">
								${0}
							</div>
						</div>
						<div class="license-widget-item-icon__arrow-right ui-icon-set --arrow-right"/>
					</div>
				</div>
			`),()=>{this.getOptions().landingCode?i.FeaturePromotersRegistry.getPromoter({code:this.getOptions().landingCode}).show():window.open(this.getOptions().link)},this.getTitle()))}getTitle(){return this.cache.remember("title",()=>s.Tag.render(_||(_=X`
				<div class="license-widget-item-name">
					<span>
						${0}
					</span>
				</div>
			`),this.getOptions().title))}}let S,K,W=e=>e;class R extends a{constructor(e){super(e),this.setEventNamespace("BX.Bitrix24.LicenseWidget.Content.Orders")}getConfig(){return{html:this.getLayout(),minHeight:"50px"}}getLayout(){return this.cache.remember("layout",()=>s.Tag.render(S||(S=W`
				<div data-id="license-widget-block-orders" onclick="${0}" class="license-widget-item license-widget-item--secondary --pointer">
					<div class="license-widget-inner">
						<div class="license-widget-content">
							<div class="license-widget-item-icon license-widget-item-icon--order"></div>
							<div class="license-widget-item-content">
								${0}
							</div>
						</div>
						<div class="license-widget-item-icon__arrow-right ui-icon-set --arrow-right"/>
					</div>
					<form id="form-purchase-history" action="${0}" method="post" target="_blank">
						<input name="license_key" value="${0}" hidden>
					</form>
				</div>
			`),e=>{document.querySelector("#form-purchase-history").submit()},this.getTitle(),this.getOptions().link,this.getOptions().hashKey))}getTitle(){return this.cache.remember("title",()=>s.Tag.render(K||(K=W`
				<div class="license-widget-item-name">
					<span>
						${0}
					</span>
				</div>
			`),this.getOptions().text))}}let j,G=e=>e;class N extends a{constructor(e){super(e),this.setEventNamespace("BX.Bitrix24.LicenseWidget.Content.Telephony")}getConfig(){return{html:this.getLayout(),minHeight:"43px",sizeLoader:30}}getLayout(){return this.cache.remember("layout",()=>s.Tag.render(j||(j=G`
				<div data-id="license-widget-block-telephony" onclick="${0}" class="license-widget-item license-widget-item--secondary --pointer">
					<div class="license-widget-inner">
						<div class="license-widget-content">
							<div class="license-widget-item-icon ${0}"/>
							<div class="license-widget-item-content">
								<div class="license-widget-item-name">
									${0}
								</div>
							</div>
						</div>
						<div class="license-widget-item-icon__arrow-right ui-icon-set --arrow-right"/>
					</div>
				</div>
			`),()=>{document.location.href=this.getOptions().link},this.getOptions().isActive?"license-widget-item-icon--tel-active":"license-widget-item-icon--tel",this.getOptions().title))}}let U,q,z,J=e=>e;class Q extends a{getConfig(){return{html:this.getLayout(),minHeight:"43px",sizeLoader:30}}getLayout(){return this.cache.remember("layout",()=>s.Tag.render(U||(U=J`
				<div onclick="${0}" data-id="license-widget-block-whatsnew" class="license-widget-item license-widget-item--secondary --pointer">
					<div class="license-widget-inner">
						<div class="license-widget-content">
							${0}
							<div class="license-widget-item-content">
								${0}
							</div>
						</div>
						<div class="license-widget-item-icon__arrow-right ui-icon-set --arrow-right"/>
					</div>
				</div>
			`),()=>{window.open(this.getOptions().link,"_blank")},this.getMainIcon(),this.getTitle()))}getMainIcon(){return this.cache.remember("main-icon",()=>s.Tag.render(q||(q=J`
				<div class="license-widget-item-icon license-widget-item-icon--updates"></div>
			`)))}getTitle(){return this.cache.remember("title",()=>s.Tag.render(z||(z=J`
				<div class="license-widget-item-name">
					<span>
						${0}
					</span>
				</div>
			`),this.getOptions().title))}}var V=babelHelpers.classPrivateFieldLooseKey("cache"),Y=babelHelpers.classPrivateFieldLooseKey("getContent"),Z=babelHelpers.classPrivateFieldLooseKey("getLicenseContent"),ee=babelHelpers.classPrivateFieldLooseKey("getMarketContent"),te=babelHelpers.classPrivateFieldLooseKey("getBaasContent"),ie=babelHelpers.classPrivateFieldLooseKey("getPurchaseHistoryContent"),se=babelHelpers.classPrivateFieldLooseKey("getTelephonyContent"),ne=babelHelpers.classPrivateFieldLooseKey("getUpdatesContent"),ae=babelHelpers.classPrivateFieldLooseKey("getPartnerContent");class re extends t.EventEmitter{constructor(e){super(),Object.defineProperty(this,ae,{value:me}),Object.defineProperty(this,ne,{value:he}),Object.defineProperty(this,se,{value:pe}),Object.defineProperty(this,ie,{value:ge}),Object.defineProperty(this,te,{value:de}),Object.defineProperty(this,ee,{value:ce}),Object.defineProperty(this,Z,{value:le}),Object.defineProperty(this,Y,{value:oe}),Object.defineProperty(this,V,{writable:!0,value:new s.Cache.MemoryCache}),this.setOptions(e),this.setEventNamespace("BX.Intranet.LicenseWidget.Popup"),this.setEventHandlers()}setOptions(e){babelHelpers.classPrivateFieldLooseBase(this,V)[V].set("options",e)}getOptions(){return babelHelpers.classPrivateFieldLooseBase(this,V)[V].get("options",{})}show(){this.getBasePopup().show(),this.emit("show")}close(){this.getBasePopup().close()}getBasePopup(){return babelHelpers.classPrivateFieldLooseBase(this,V)[V].remember("popup",()=>(this.emit("init"),new n.PopupComponentsMaker({target:this.getOptions().target,width:374,content:babelHelpers.classPrivateFieldLooseBase(this,Y)[Y](),popupLoader:this.getOptions().loader})))}setEventHandlers(){const e=()=>{this.close()};this.subscribe("init",()=>{t.EventEmitter.subscribe(t.EventEmitter.GLOBAL_TARGET,"SidePanel.Slider:onOpenStart",e),t.EventEmitter.subscribe(t.EventEmitter.GLOBAL_TARGET,"BX.Intranet.LicenseWidget.Popup:openChild",e)})}}function oe(){return babelHelpers.classPrivateFieldLooseBase(this,V)[V].remember("content",()=>{const e=[];return this.getOptions().content.license.isAvailable&&e.push(babelHelpers.classPrivateFieldLooseBase(this,Z)[Z]().getConfig()),this.getOptions().content.baas.isAvailable&&this.getOptions().content.market.isAvailable?e.push({html:[babelHelpers.classPrivateFieldLooseBase(this,ee)[ee](!0).getConfig(),babelHelpers.classPrivateFieldLooseBase(this,te)[te](!0).getConfig()]}):this.getOptions().content.market.isAvailable?e.push(babelHelpers.classPrivateFieldLooseBase(this,ee)[ee](!1).getConfig()):this.getOptions().content.baas.isAvailable&&e.push(babelHelpers.classPrivateFieldLooseBase(this,te)[te](!1).getConfig()),e.push(babelHelpers.classPrivateFieldLooseBase(this,ie)[ie]().getConfig()),this.getOptions().content.telephony.isAvailable?e.push({html:[babelHelpers.classPrivateFieldLooseBase(this,se)[se]().getConfig(),babelHelpers.classPrivateFieldLooseBase(this,ne)[ne]().getConfig()]}):e.push(babelHelpers.classPrivateFieldLooseBase(this,ne)[ne]().getConfig()),this.getOptions().content.partner.isAvailable&&e.push(babelHelpers.classPrivateFieldLooseBase(this,ae)[ae]().getConfig()),e})}function le(){return babelHelpers.classPrivateFieldLooseBase(this,V)[V].remember("license-content",()=>new I({...this.getOptions().content.license}))}function ce(e){return babelHelpers.classPrivateFieldLooseBase(this,V)[V].remember("market-content",()=>new h({...this.getOptions().content.market,isSmall:e}))}function de(e){return babelHelpers.classPrivateFieldLooseBase(this,V)[V].remember("baas-content",()=>new y({licensePopupTarget:this.getOptions().target,licensePopup:this,isAdmin:this.getOptions().isAdmin,isSmall:e}))}function ge(){return babelHelpers.classPrivateFieldLooseBase(this,V)[V].remember("purchase-history-content",()=>new R({...this.getOptions().content["purchase-history"]}))}function pe(){return babelHelpers.classPrivateFieldLooseBase(this,V)[V].remember("telephony-content",()=>new N({...this.getOptions().content.telephony}))}function he(){return babelHelpers.classPrivateFieldLooseBase(this,V)[V].remember("updates-content",()=>new Q({...this.getOptions().content.updates}))}function me(){return babelHelpers.classPrivateFieldLooseBase(this,V)[V].remember("partner-content",()=>new D({...this.getOptions().content.partner}))}var be=babelHelpers.classPrivateFieldLooseKey("cache"),ue=babelHelpers.classPrivateFieldLooseKey("instance"),ve=babelHelpers.classPrivateFieldLooseKey("getPopup");class we{constructor(){Object.defineProperty(this,ve,{value:Oe}),Object.defineProperty(this,be,{writable:!0,value:new s.Cache.MemoryCache})}static getInstance(){return babelHelpers.classPrivateFieldLooseBase(this,ue)[ue]||(babelHelpers.classPrivateFieldLooseBase(this,ue)[ue]=new this),babelHelpers.classPrivateFieldLooseBase(this,ue)[ue]}show(){babelHelpers.classPrivateFieldLooseBase(this,ve)[ve]().getBasePopup().isShown()||babelHelpers.classPrivateFieldLooseBase(this,ve)[ve]().show()}setOptions(e){return babelHelpers.classPrivateFieldLooseBase(this,be)[be].set("options",e),this}getOptions(){return babelHelpers.classPrivateFieldLooseBase(this,be)[be].get("options",{})}}function Oe(){return babelHelpers.classPrivateFieldLooseBase(this,be)[be].remember("popup",()=>new re({target:this.getOptions().buttonWrapper,loader:this.getOptions().loader,content:{...this.getOptions().data}}))}Object.defineProperty(we,ue,{writable:!0,value:void 0}),e.LicenseWidget=we}(this.BX.Intranet=this.BX.Intranet||{},BX.Event,BX.UI,BX,BX.UI);
//# sourceMappingURL=license-widget.bundle.js.map
