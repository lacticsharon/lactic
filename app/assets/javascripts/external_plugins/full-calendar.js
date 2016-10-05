/**
 * Created by sharonanachum on 8/4/15.
 */
//var updateEvent;

//$(document).ready(function() {
    //console.log("ready!");
    //return $('#calendar').fullCalendar(full_calendar_options)});
    //    editable: true,
    //    header: {
    //        left: 'prev,next today',
    //        center: 'title',
    //        right: 'month,agendaWeek,agendaDay'
    //    },
    //    defaultView: 'agendaWeek',
    //    height: 500,
    //    slotMinutes: 30,
    //    eventSources: [
    //        {
    //            url: '/osm_sessions/'
    //        }
    //    ],
    //    timeFormat: 'h:mm t{ - h:mm t} ',
    //    dragOpacity: "0.5"
    //,
    //eventDrop: function(event, dayDelta, minuteDelta, allDay, revertFunc) {
    //    console.log("EVENT " + event);
    //    return updateEvent(event);
    //},
    //eventResize: function(event, dayDelta, minuteDelta, revertFunc) {
    //    console.log("EVENT " + event);
    //    return updateEvent(event);
    //}
    //});
//});

full_calendar_options=
{
    editable:!0,
    header:{
        //left:"prev,next today",
        //center:"title"
        //right:"month,agendaWeek,agendaDay"
    },
    defaultView:"month",
    height:"500",
    slotMinutes:15,
    dragOpacity:.5,
    selectable: true,
    selectHelper: true,
    timeFormat:"h:mm t{ - h:mm t}",
    editable: true,
    //ignoreTimezone:!1,
    //layout:"fullcalendar",
    //mount_path:"/fullcalendar/demo",



    //events:'/osm_sessions/'
    events:'/lactics'
},

    app_path="",
    $.extend(full_calendar_options,{
        loading:function(t){t?$("#loading").show():$("#loading").hide()
        },
        eventDrop:function(t,e,i,s){
            //console.log("START "+new Date(t.getTime())+" END "+new Date(e.getTime()));
            FullcalendarEngine.Events.move(t,e,i,s)},
        eventResize:function(t,e,i){
            FullcalendarEngine.Events.resize(t,e,i)
        },
        eventClick:function(t){
            FullcalendarEngine.Events.showEventDetails(t)
        },
        select:function(t,e,i){
            //console.log("START "+new Date(t.getTime())+" END "+new Date(e.getTime()));
            FullcalendarEngine.Form.display({
                starttime:new Date(t.getTime()),
                endtime:new Date(e.getTime()),
                allDay:i
            })
        }
    }),
"undefined"==typeof FullcalendarEngine&&(FullcalendarEngine={}),
    FullcalendarEngine={
        Form:{
            display:function(t){

                "undefined"==typeof t&&(t={}),
                    FullcalendarEngine.Form.fetch(t)
            },
            render:function(t){
                //console.log("START "+t.starttime+" END "+t.endtime);

                $("#event_form").trigger("reset");
                var e=t.starttime||new Date,
                    i=t.endtime||new Date(e.getTime());

                //console.log("STARTING "+e+" ENDING "+i);
                e.getTime()==i.getTime()&&i.setMinutes(e.getMinutes()+15),
                    FullcalendarEngine.setTime("#event_starttime",e),
                    FullcalendarEngine.setTime("#event_endtime",i),
                    $("#event_all_day").attr("checked",t.allDay),
                    $("#create_event_dialog").dialog({
                        title:"New Event",
                        modal:!0,
                        width:500,close:function(){
                            $("#create_event_dialog").dialog("destroy")
                        }
                    })
            },
            fetch:function(t){
                $.ajax({
                    type:"get",
                    dataType:"script",
                    async:!0,
                    //url:FullcalendarEngine.app_path()+"/osm_sessions/new",success:function(){
                    url:FullcalendarEngine.app_path()+"/lactic_sessions/new",
                    success:function(){
                        FullcalendarEngine.Form.render(t)}})},authenticity_token:function(){
                return $('meta[name="csrf-token"]').attr("content")}},
        Events:{
            move:function(t,e,i,s){$.ajax({
                data:"title="+t.title+"&day_delta="+e+"&minute_delta="+i+"&all_day="+s+"&authenticity_token="+FullcalendarEngine.Form.authenticity_token(),
                dataType:"script",
                type:"post",url:FullcalendarEngine.app_path()+"/events/"+t.id+"/move",
                error:function(t){
                    //alert(JSON.parse(t.responseText).message)
                }
            })
            },
            resize:function(t,e,i){
                $.ajax({
                    data:"title="+t.title+"&day_delta="+e+"&minute_delta="+i+"&authenticity_token="+FullcalendarEngine.Form.authenticity_token(),
                    dataType:"script",
                    type:"post",
                    //url:FullcalendarEngine.app_path()+"/osm_sessions/"+t.id+"/resize",
                    url:FullcalendarEngine.app_path()+"/lactic_sessions/"+t.id+"/resize",
                    error:function(t){
                        //alert(JSON.parse(t.responseText).message)
                    }
                })
            },
            edit:function(t){
                $.ajax({
                    //url:FullcalendarEngine.app_path()+"/osm_sessions/"+t+"/edit",
                    url:FullcalendarEngine.app_path()+"/lactic_sessions/"+t+"/edit",
                    success:function(t){
                        $("#edit_event_description").html(t.form)
                    }
                })
            },
            "delete":function(t,e){

                $.ajax({
                    data:"authenticity_token="+FullcalendarEngine.Form.authenticity_token()+"&delete_all="+e,
                    dataType:"script",
                    type:"delete",
                    //url:FullcalendarEngine.app_path()+"/osm_sessions/"+t,
                    url:FullcalendarEngine.app_path()+"/lactic_sessions/"+t,
                    success:FullcalendarEngine.Events.refetch_events_and_close_dialog
                })
            },
            refetch_events_and_close_dialog:function(){

                $('#calendar').fullCalendar("refetchEvents"),
                    $(".dialog:visible").dialog("destroy")
            },
            showEventDetails:function(t){

                $("#event_desc_dialog").html(""),
                    $event_description=$("<div />").html(t.description).attr("id","edit_event_description"),
                    $event_actions=$("<div />").attr("id","event_actions"),
                    $edit_event=$("<span />").attr("id","edit_event").html("<a href = 'javascript:void(0);' onclick ='FullcalendarEngine.Events.edit("+t.id+")'>Edit</a>"),
                    $delete_event=$("<span />").attr("id","delete_event"),t.recurring?(title=t.title+"(Recurring)",
                    $delete_event.html("&nbsp; <a href = 'javascript:void(0);' onclick ='FullcalendarEngine.Events.delete("+t.id+", "+!1+")'>Delete Only This Occurrence</a>"),
                    $delete_event.append("&nbsp;&nbsp; <a href = 'javascript:void(0);' onclick ='FullcalendarEngine.Events.delete("+t.id+", "+!0+")'>Delete All In Series</a>"),
                    $delete_event.append("&nbsp;&nbsp; <a href = 'javascript:void(0);' onclick ='FullcalendarEngine.Events.delete("+t.id+', "future")\'>Delete All Future Events</a>')):(title=t.title,
                    $delete_event.html("<a href = 'javascript:void(0);' onclick ='FullcalendarEngine.Events.delete("+t.id+", "+!1+")'>Delete</a>")),$event_actions.append($edit_event).append(" | ").append($delete_event),
                    $("#event_desc_dialog").append($event_description).append($event_actions),
                    $("#event_desc_dialog").dialog({
                        title:title,
                        modal:!0,
                        width:500,
                        close:function(){
                            $("#event_desc_dialog").html(""),
                                $("#event_desc_dialog").dialog("destroy")
                        }
                    })
            },
            showPeriodAndFrequency:function(t){switch(t){
                case"Daily":$("#period").html("day"),
                    $("#frequency").show();
                    break;
                case"Weekly":$("#period").html("week"),
                    $("#frequency").show();
                    break;
                case"Monthly":$("#period").html("month"),
                    $("#frequency").show();
                    break;
                case"Yearly":$("#period").html("year"),
                    $("#frequency").show();
                    break;
                default:$("#frequency").hide()}}},
        setTime:function(t,e){
            //console.log("START "+new Date(t.getTime())+" END "+new Date(e.getTime()));
            var i=$(t+"_1i"),
                s=$(t+"_2i"),
                n=$(t+"_3i"),
                a=$(t+"_4i"),
                o=$(t+"_5i");
            i.val(e.getFullYear()),
                s.prop("selectedIndex",e.getMonth()),
                n.prop("selectedIndex",e.getDate()-1),
                a.prop("selectedIndex",e.getHours()),
                o.prop("selectedIndex",e.getMinutes())
        },
        app_path:function(){
            return app_path||window.location.pathname.match(/\/(\w)+/)[0]
        }
    },
    $(document).ready(function(){
        $("#create_event_dialog, #event_desc_dialog").on("submit","#event_form",function(t){
            function e(){n.show()
            }
            function i(){
                n.hide()
            }
            function s(t){
                //alert(t.responseText)
            }
            var n=$(".spinner");
            t.preventDefault(),
                $.ajax({
                    type:"POST",
                    data:$(this).serialize(),
                    url:$(this).attr("action"),
                    beforeSend:e,
                    complete:i,
                    success:FullcalendarEngine.Events.refetch_events_and_close_dialog,
                    error:s
                })
        })

    }),
    function(t,e){
        function i(e){
            t.extend(!0,De,e)
        }
        function s(i,s,h){
            function c(t){

                ne?m()&&(k(),
                    C(t)):u()
            }
            function u(){

                ae=s.theme?"ui":"fc",i.addClass("fc"),
                    s.isRTL?i.addClass("fc-rtl"):i.addClass("fc-ltr"),
                s.theme&&i.addClass("ui-widget"),
                    ne=t("<div class='fc-content lactic-calendar' style='position:relative'/>").prependTo(i),
                    ie=new n(ee,s),
                    se=ie.render(),
                se&&i.prepend(se),
                    _(s.defaultView),
                s.handleWindowResize&&t(window).resize(T),
                v()||p()
            }
            function p(){

                setTimeout(function(){
                        !oe.start&&v()&&D()
                    }
                    ,
                    0)
            }
            function f(){
                oe&&(te("viewDestroy",oe,oe,oe.element),
                    oe.triggerEventDestroy()),
                    t(window).unbind("resize",T),
                    ie.destroy(),
                    ne.remove(),
                    i.removeClass("fc fc-rtl ui-widget")
            }
            function m(){
                return i.is(":visible")
            }
            function v(){
                console.log("calendar2 eventSources vvvv" );
                return t("body").is(":visible")
            }
            function _(t){
                oe&&t==oe.name||w(t)
            }
            function w(e){
                //console.log("event "+oe);
                fe++,oe&&(te("viewDestroy",oe,oe,oe.element),
                    j(),
                    oe.triggerEventDestroy(),
                    Q(),
                    oe.element.remove(),
                    ie.deactivateButton(oe.name)),
                    ie.activateButton(e),
                    oe=new ke[e](t("<div class='fc-view fc-view-"+e+"' style='position:relative'/>").appendTo(ne),
                        ee),
                    D(),
                    G(),
                    fe--
            }
            function D(t){
                (!oe.start||t||ge<oe.start||ge>=oe.end)&&m()&&C(t)
            }
            function C(t){
                fe++,oe.start&&(te("viewDestroy",oe,oe,oe.element),
                    j(),
                    z()),
                    Q(),
                    oe.render(ge,t||0),M(),G(),
                    (oe.afterRender||N)(),O(),R(),
                    te("viewRender",oe,oe,oe.element),
                    oe.trigger("viewDisplay",de),fe--,H()
            }
            function x(){m()&&(j(),z(),k(),M(),S())
            }
            function k(){
                le=s.contentHeight?s.contentHeight:s.height?s.height-(se?se.height():0)-E(ne):Math.round(ne.width()/Math.max(s.aspectRatio,.5))
            }
            function M(){
                le===e&&k(),
                    fe++,oe.setHeight(le),
                    oe.setWidth(ne.width()),
                    fe--,re=i.outerWidth()
            }
            function T(){
                if(!fe)
                    if(oe.start){
                        var t=++pe;
                        setTimeout(function(){
                            t==pe&&!fe&&m()&&re!=(re=i.outerWidth())&&(fe++,x(),
                                oe.trigger("windowResize",de),fe--)},200)
                    }
                    else p()
            }
            function I(){
                z(),
                    A()
            }
            function P(t){z(),S(t)
            }
            function S(t){
                m()&&(oe.setEventData(me),
                    oe.renderEvents(me,t),
                    oe.trigger("eventAfterAllRender"))
            }
            function z(){
                oe.triggerEventDestroy(),
                    oe.clearEvents(),
                    oe.clearEventData()
            }
            function H(){
                !s.lazyFetching||ce(oe.visStart,oe.visEnd)?A():S()
            }
            function A(){

                ue(oe.visStart,oe.visEnd)
            }
            function W(t){
                me=t,S()
            }
            function F(t){
                P(t)
            }
            function O(){
                ie.updateTitle(oe.title)
            }
            function R(){
                var t=new Date;
                t>=oe.start&&t<oe.end?ie.disableButton("today"):ie.enableButton("today")
            }
            function L(t,i,s){
                oe.select(t,i,s===e?!0:s)
            }
            function j(){
                oe&&oe.unselect()
            }
            function Y(){
                D(-1)
            }
            function B(){
                D(1)
            }
            function $(){
                o(ge,-1),D()
            }
            function q(){
                o(ge,1),D()
            }
            function U(){
                ge=new Date,D()
            }
            function K(t,e,i){
                t instanceof Date?ge=d(t):g(ge,t,e,i),D()
            }
            function V(t,i,s){
                t!==e&&o(ge,t),i!==e&&r(ge,i),s!==e&&l(ge,s),D()
            }
            function X(){
                return d(ge)
            }
            function Q(){
                ne.css({
                    width:"100%",
                    height:ne.height(),
                    overflow:"hidden"
                })
            }
            function G(){
                ne.css({
                    width:"",
                    height:"",
                    overflow:""
                })
            }
            function J(){
                return oe
            }
            function Z(t,i){
                return i===e?s[t]:(("height"==t||"contentHeight"==t||"aspectRatio"==t)&&(s[t]=i,x()),void 0)
            }
            function te(t,e){
                return s[t]?s[t].apply(e||de,Array.prototype.slice.call(arguments,2)):void 0
            }
            var ee=this;
            ee.options=s,
                ee.render=c,
                ee.destroy=f,
                ee.refetchEvents=I,
                ee.reportEvents=W,
                ee.reportEventChange=F,
                ee.rerenderEvents=P,
                ee.changeView=_,
                ee.select=L,
                ee.unselect=j,
                ee.prev=Y,
                ee.next=B,
                ee.prevYear=$,
                ee.nextYear=q,
                ee.today=U,
                ee.gotoDate=K,
                ee.incrementDate=V,
                ee.formatDate=function(t,e){
                    return b(t,e,s)
                },
                ee.formatDates=function(t,e,i){return y(t,e,i,s)},
                ee.getDate=X,
                ee.getView=J,ee.option=Z,ee.trigger=te,a.call(ee,s,h);
            var ie,se,ne,ae,oe,re,le,he,ce=ee.isFetchNeeded,
                ue=ee.fetchEvents,de=i[0],pe=0,fe=0,ge=new Date,me=[];
            g(ge,s.year,s.month,s.date),s.droppable&&t(document).bind("dragstart",
                function(e,i){
                    var n=e.target,a=t(n);
                    if(!a.parents(".fc").length){
                        var o=s.dropAccept;
                        (t.isFunction(o)?o.call(n,a):a.is(o))&&(he=n,oe.dragStart(he,e,i))
                    }
                }).bind("dragstop",function(t,e){
                    he&&(oe.dragStop(he,t,e),he=null)
                })
        }
        function n(e,i){
            function s(){
                d=i.theme?"ui":"fc";var e=i.header;
                return e?p=t("<table class='fc-header' style='width:100%'/>").append(t("<tr/>").append(a("left")).append(a("center")).append(a("right"))):void 0
            }
            function n(){
                p.remove()
            }
            function a(s){

                var n=t("<td class='fc-header-"+s+"'/>"),
                    a=i.header[s];
                return a&&t.each(a.split(" "),
                    function(s){
                        s>0&&n.append("<span class='fc-header-space'/>");
                        var a;t.each(this.split(","),
                            function(s,o){
                                if("title"==o)n.append("<span class='fc-header-title'><h5>&nbsp;</h5></span>"),
                                a&&a.addClass(d+"-corner-right"),
                                    a=null;
                                else{

                                    var r;
                                    if(e[o]?r=e[o]:ke[o]&&(r=function(){
                                            c.removeClass(d+"-state-hover"),
                                                e.changeView(o)
                                        })
                                            ,r){
                                        var l=i.theme?R(i.buttonIcons,o):null,h=R(i.buttonText,o),
                                            c=t("<span class='fc-button fc-button-"+o+" "+d+"-state-default'>"+(l?"<span class='fc-icon-wrap'><span class='ui-icon ui-icon-"+l+"'/></span>":h)+"</span>").click(function(){
                                            c.hasClass(d+"-state-disabled")||r()
                                        }).mousedown(function(){
                                            c.not("."+d+"-state-active").not("."+d+"-state-disabled").addClass(d+"-state-down")
                                        }).mouseup(function(){
                                            c.removeClass(d+"-state-down")}).hover(function(){
                                                c.not("."+d+"-state-active").not("."+d+"-state-disabled").addClass(d+"-state-hover")},
                                            function(){
                                                c.removeClass(d+"-state-hover").removeClass(d+"-state-down")
                                            }).appendTo(n);j(c),a||c.addClass(d+"-corner-left"),
                                            a=c
                                    }
                                }
                            }),
                        a&&a.addClass(d+"-corner-right")}),n
            }
            function o(t){
                //alert("FIND setting "+t);
                p.find("h5").html(t)
            }
            function r(t){
                p.find("span.fc-button-"+t).addClass(d+"-state-active")
            }
            function l(t){
                p.find("span.fc-button-"+t).removeClass(d+"-state-active")
            }
            function h(t){
                p.find("span.fc-button-"+t).addClass(d+"-state-disabled")
            }
            function c(t){
                p.find("span.fc-button-"+t).removeClass(d+"-state-disabled")
            }
            var u=this;
            u.render=s,u.destroy=n,u.updateTitle=o,u.activateButton=r,u.deactivateButton=l,u.disableButton=h,u.enableButton=c;
            var d,p=t([])
        }
        function a(i,s){
            function n(t,e){
                return!x||x>t||e>k
            }
            function a(t,e){
                x=t,k=e,A=[];var i=++E,s=S.length;z=s;
                for(var n=0;s>n;n++)o(S[n],i)
            }
            function o(e,s){
                r(e,function(n){
                    if(s==E){
                        if(n){
                            console.log("EVENT "+n);
                            i.eventDataTransform&&(n=t.map(n,i.eventDataTransform)),
                            e.eventDataTransform&&(n=t.map(n,e.eventDataTransform));
                            for(var a=0;a<n.length;a++) {
                                n[a].source = e, b(n[a]);
                                console.log("EVENT "+n[a]);
                            }
                            A=A.concat(n)
                        }
                        z--,z||I(A)
                    }
                })
            }
            function r(e,s){
                var n,a,o=xe.sourceFetchers;
                for(n=0;n<o.length;n++){
                    if(a=o[n](e,x,k,s),a===!0)
                        return;
                    if("object"==typeof a)
                        return r(a,s),
                            void 0
                }
                var l=e.events;
                if(l)t.isFunction(l)?(v(),
                    l(d(x),d(k),
                        function(t){
                            s(t),_()
                        }
                    )):t.isArray(l)?s(l):s();
                else{
                    var h=e.url;
                    if(h){
                        var c,
                            u=e.success,
                            p=e.error,
                            f=e.complete;
                        c=t.isFunction(e.data)?e.data():e.data;
                        var g=t.extend({},c||{}),
                            m=q(e.startParam,i.startParam),
                            b=q(e.endParam,i.endParam),
                            view_month=q(e.monthParam,i.monthParam);
                        m&&(g[m]=Math.round(+x/1e3)),
                        b&&(g[b]=Math.round(+k/1e3)),
                        view_month&&(g[view_month]=document.getElementById("month_view_date").value),
                            v(),
                            t.ajax(t.extend({},Me,e,
                            {
                                data:g,
                                success:function(e){
                                    //console.log("MESSAGE URL ??? "+JSON.stringify(e)+ " arg "+JSON.stringify(arguments)+" GGGG "+JSON.stringify(g));
                                    console.log("MESSAGE URL ??? "+JSON.stringify(g));
                                    e=e||[];
                                    var i=$(u,this,arguments);
                                    t.isArray(i)&&(e=i),s(e)},
                                error:function(){
                                    $(p,this,arguments),
                                        s()},
                                complete:function(){
                                    $(f,this,arguments),
                                        _()
                                }
                            }))
                    }
                    else
                        s()
                }
            }
            function l(t){
                t=h(t),t&&(z++,o(t,E))
            }
            function h(e){
                return t.isFunction(e)||t.isArray(e)?e={events:e}:"string"==typeof e&&(e={url:e}),
                    "object"==typeof e?(y(e),S.push(e),e):void 0
            }
            function c(e){
                S=t.grep(S,function(t){return!w(t,e)}),
                    A=t.grep(A,function(t){return!w(t.source,e)}),I(A)
            }
            function u(t){

                var e,i,s=A.length,n=T().defaultEventEnd,
                    a=t.start-t._start,
                    o=t.end?t.end-(t._end||n(t)):0;
                for(e=0;s>e;e++)
                    i=A[e],
                    i._id==t._id&&i!=t&&(i.start=new Date(+i.start+a),
                        i.end=t.end? i.end? new Date(+i.end+o):new Date(+n(i)+o):null,
                        i.title=t.title,
                        i.url=t.url,
                        i.allDay=t.allDay,
                        i.className=t.className,
                        i.editable=t.editable,
                        i.color=t.color,
                        i.backgroundColor=t.backgroundColor,
                        i.borderColor=t.borderColor,
                        i.textColor=t.textColor,b(i));

                b(t), I(A)

                console.log("START "+ i.start+"ENDS "+ i.end);
            }
            function p(t,e){

                b(t),t.source||(e&&(P.events.push(t),t.source=P),
                    A.push(t)),I(A)
            }
            function f(e){
                if(e){
                    if(!t.isFunction(e)){
                        var i=e+"";
                        e=function(t){
                            return t._id==i
                        }
                    }
                    A=t.grep(A,e,!0);
                    for(var s=0;s<S.length;s++)
                        t.isArray(S[s].events)&&(S[s].events=t.grep(S[s].events,e,!0))
                }
                else{A=[];
                    for(var s=0;s<S.length;s++)
                        t.isArray(S[s].events)&&(S[s].events=[])
                }
                I(A)
            }
            function g(e){
                return t.isFunction(e)?t.grep(A,e):e?(e+="",t.grep(A,
                    function(t){return t._id==e})):A
            }
            function v(){
                H++||M("loading",null,!0,T())
            }
            function _(){--H||M("loading",null,!1,T())}
            function b(t){
                console.log("START "+d(t.start=m(t.start,q(s,i)))+" ENDS "+m(t.end,q(s,i)));
                //console.log(" all day "+e&&(q(t.source.allDayDefault,i.allDayDefault)));

                var s=t.source||{},
                    n=q(s.ignoreTimezone,i.ignoreTimezone);

                t._id=t._id||(t.id===e?"_fc"+Te++:t.id+""),
                t.date&&(t.start||(t.start=t.date),delete t.date),


                    t._start=d(t.start=m(t.start,n)),


                    t.end=m(t.end,n),
                t.end&&t.end<=t.start&&(t.end=null),

                    t._end=t.end?d(t.end):null,
                    //t.allDay===e&&(t.allDay=q(s.allDayDefault,i.allDayDefault)),
                t.allDay===false,
                    t.className?"string"==typeof t.className&&(t.className=t.className.split(/\s+/)):t.className=[]
            }
            function y(t){
                t.className?"string"==typeof t.className&&(t.className=t.className.split(/\s+/)):t.className=[];
                for(var e=xe.sourceNormalizers,i=0;i<e.length;i++)
                    e[i](t)
            }
            function w(t,e){
                return t&&e&&D(t)==D(e)
            }
            function D(t){
                return("object"==typeof t?t.events||t.url:"")||t
            }
            var C=this;
            C.isFetchNeeded=n,
                C.fetchEvents=a,
                C.addEventSource=l,
                C.removeEventSource=c,
                C.updateEvent=u,
                C.renderEvent=p,
                C.removeEvents=f,
                C.clientEvents=g,
                C.normalizeEvent=b;
            for(var x,k,M=C.trigger,T=C.getView,I=C.reportEvents,
                    P={events:[]},S=[P],E=0,z=0,H=0,A=[],N=0;N<s.length;N++)h(s[N])
        }
        function o(t,e,i){
            return t.setFullYear(t.getFullYear()+e),i||u(t),t
        }
        function r(t,e,i){
            if(+t){
                var s=t.getMonth()+e,n=d(t);

                for(n.setDate(1),n.setMonth(s),t.setMonth(s),i||u(t);t.getMonth()!=n.getMonth();)
                    t.setDate(t.getDate()+(n>t?1:-1))
            }
            //alert("chaging month settings");
            return t
        }
        function l(t,e,i){
            if(+t){
                var s=t.getDate()+e,n=d(t);
                n.setHours(9),n.setDate(s),t.setDate(s),i||u(t),h(t,n)
            }
            return t
        }
        function h(t,e){
            if(+t)
                for(;t.getDate()!=e.getDate();)
                    t.setTime(+t+(e>t?1:-1)*Se)
        }
        function c(t,e){
            return t.setMinutes(t.getMinutes()+e),t
        }
        function u(t){
            return t.setHours(0),t.setMinutes(0),t.setSeconds(0),t.setMilliseconds(0),t
        }
        function d(t,e){
            return e?u(new Date(+t)):new Date(+t)
        }
        function p(){
            var t,e=0;do t=new Date(1970,e++,1);
            while(t.getHours());return t
        }
        function f(t,e){
            return Math.round((d(t,!0)-d(e,!0))/Pe)
        }
        function g(t,i,s,n){
            i!==e&&i!=t.getFullYear()&&(t.setDate(1),t.setMonth(0),t.setFullYear(i)),
            s!==e&&s!=t.getMonth()&&(t.setDate(1),t.setMonth(s)),
            n!==e&&t.setDate(n)
        }
        function m(t,i){
            return"object"==typeof t?t:"number"==typeof t?new Date(1e3*t):"string"==typeof t?t.match(/^\d+(\.\d+)?$/)?new Date(1e3*parseFloat(t)):(i===e&&(i=!0),v(t,i)||(t?new Date(t):null)):null
        }
        function v(t,e){
            var i=t.match(/^([0-9]{4})(-([0-9]{2})(-([0-9]{2})([T ]([0-9]{2}):([0-9]{2})(:([0-9]{2})(\.([0-9]+))?)?(Z|(([-+])([0-9]{2})(:?([0-9]{2}))?))?)?)?)?$/);
            if(!i)
                return null;
            var s=new Date(i[1],0,1);
            if(e||!i[13]){
                var n=new Date(i[1],0,1,9,0);i[3]&&(s.setMonth(i[3]-1),n.setMonth(i[3]-1)),i[5]&&(s.setDate(i[5]),n.setDate(i[5])),h(s,n),i[7]&&s.setHours(i[7]),i[8]&&s.setMinutes(i[8]),i[10]&&s.setSeconds(i[10]),i[12]&&s.setMilliseconds(1e3*Number("0."+i[12])),h(s,n)
            }
            else if(s.setUTCFullYear(i[1],i[3]?i[3]-1:0,i[5]||1),s.setUTCHours(i[7]||0,i[8]||0,i[10]||0,i[12]?1e3*Number("0."+i[12]):0),i[14]){var a=60*Number(i[16])+(i[18]?Number(i[18]):0);a*="-"==i[15]?1:-1,s=new Date(+s+60*a*1e3)
            }
            return s
        }
        function _(t){
            if("number"==typeof t)
                return 60*t;if("object"==typeof t)
                return 60*t.getHours()+t.getMinutes();
            var e=t.match(/(\d+)(?::(\d+))?\s*(\w+)?/);
            if(e){
                var i=parseInt(e[1],10);
                return e[3]&&(i%=12,"p"==e[3].toLowerCase().charAt(0)&&(i+=12)),
                60*i+(e[2]?parseInt(e[2],10):0)
            }
        }
        function b(t,e,i){
            return y(t,null,e,i)
        }
        function y(t,e,i,s){
            s=s||De;
            var n,a,o,r,l=t,h=e,c=i.length,u="";
            for(n=0;c>n;n++)
                if(a=i.charAt(n),"'"==a){
                    for(o=n+1;c>o;o++)
                        if("'"==i.charAt(o)){l&&(u+=o==n+1?"'":i.substring(n+1,o),n=o)
                        ;
                            break
                        }
                }
                else if("("==a){
                    for(o=n+1;c>o;o++)
                        if(")"==i.charAt(o)){
                            var d=b(l,i.substring(n+1,o),s);
                            parseInt(d.replace(/\D/,""),10)&&(u+=d),n=o;
                            break
                        }
                }
                else if("["==a){for(o=n+1;c>o;o++)
                    if("]"==i.charAt(o)){
                        var p=i.substring(n+1,o),d=b(l,p,s);d!=b(h,p,s)&&(u+=d),n=o;
                        break
                    }
                }
                else if("{"==a)l=e,h=t;
                else if("}"==a)l=t,h=e;
                else{
                    for(o=c;o>n;o--)
                        if(r=ze[i.substring(n,o)]){
                            l&&(u+=r(l,s)),n=o-1;
                            break
                        }
                    o==n&&l&&(u+=a)
                }
            return u
        }
        function w(t){
            var e,i=new Date(t.getTime());
            return i.setDate(i.getDate()+4-(i.getDay()||7)),e=i.getTime(),i.setMonth(0),i.setDate(1),Math.floor(Math.round((e-i)/864e5)/7)+1
        }
        function D(t){
            return t.end?C(t.end,t.allDay):l(d(t.start),1)
        }
        function C(t,e){
            return t=d(t),e||t.getHours()||t.getMinutes()?l(t,1):u(t)
        }
        function x(i,s,n){i.unbind("mouseover").mouseover(function(i){
            for(var a,o,r,l=i.target;l!=this;)
                a=l,l=l.parentNode;(o=a._fci)!==e&&(a._fci=e,r=s[o],n(r.event,r.element,r),t(i.target).trigger(i)),i.stopPropagation()
        })
        }
        function k(e,i,s){
            for(var n,a=0;a<e.length;a++)n=t(e[a]),n.width(Math.max(0,i-T(n,s)))
        }
        function M(e,i,s){
            for(var n,a=0;a<e.length;a++)n=t(e[a]),n.height(Math.max(0,i-E(n,s)))
        }
        function T(t,e){
            return I(t)+S(t)+(e?P(t):0)
        }
        function I(e){
            return(parseFloat(t.css(e[0],"paddingLeft",!0))||0)+(parseFloat(t.css(e[0],"paddingRight",!0))||0)
        }
        function P(e){
            return(parseFloat(t.css(e[0],"marginLeft",!0))||0)+(parseFloat(t.css(e[0],"marginRight",!0))||0)
        }
        function S(e){
            return(parseFloat(t.css(e[0],"borderLeftWidth",!0))||0)+(parseFloat(t.css(e[0],"borderRightWidth",!0))||0)
        }
        function E(t,e){
            return z(t)+A(t)+(e?H(t):0)
        }
        function z(e){
            return(parseFloat(t.css(e[0],"paddingTop",!0))||0)+(parseFloat(t.css(e[0],"paddingBottom",!0))||0)
        }
        function H(e){
            return(parseFloat(t.css(e[0],"marginTop",!0))||0)+(parseFloat(t.css(e[0],"marginBottom",!0))||0)
        }
        function A(e){
            return(parseFloat(t.css(e[0],"borderTopWidth",!0))||0)+(parseFloat(t.css(e[0],"borderBottomWidth",!0))||0)
        }
        function N(){}
        function W(t,e){return t-e}
        function F(t){return Math.max.apply(Math,t)}
        function O(t){return(10>t?"0":"")+t}
        function R(t,i){
            if(t[i]!==e)
                return t[i];
            for(var s,n=i.split(/(?=[A-Z])/),a=n.length-1;a>=0;a--)
                if(s=t[n[a].toLowerCase()],s!==e)
                    return s;
            return t[""]
        }
        function L(t){
            return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/'/g,"&#039;").replace(/"/g,"&quot;").replace(/\n/g,"<br />")
        }
        function j(t){
            t.attr("unselectable","on").css("MozUserSelect","none").bind("selectstart.ui",
                function(){return!1})
        }
        function Y(t){
            t.children().removeClass("fc-first fc-last").filter(":first-child").addClass("fc-first").end().filter(":last-child").addClass("fc-last")
        }
        function B(t,e){
            var i=t.source||{},s=t.color,n=i.color,a=e("eventColor"),o=t.backgroundColor||s||i.backgroundColor||n||e("eventBackgroundColor")||a,r=t.borderColor||s||i.borderColor||n||e("eventBorderColor")||a,l=t.textColor||i.textColor||e("eventTextColor"),h=[];
            return o&&h.push("background-color:"+o),
            r&&h.push("border-color:"+r),
            l&&h.push("color:"+l),h.join(";")
        }
        function $(e,i,s){
            if(t.isFunction(e)&&(e=[e]),e){
                var n,a;for(n=0;n<e.length;n++)a=e[n].apply(i,s)||a;
                return a
            }
        }
        function q(){
            for(var t=0;t<arguments.length;t++)
                if(arguments[t]!==e)
                    return arguments[t]
        }
        function U(t,e){
            function i(t,e){e&&(r(t,e),t.setDate(1));
                var i=n("firstDay"),u=d(t,!0);
                u.setDate(1);
                var p=r(d(u),1),g=d(u);l(g,-((g.getDay()-i+7)%7)),o(g);
                var m=d(p);l(m,(7-m.getDay()+i)%7),o(m,-1,!0);
                var v=h(),_=Math.round(f(m,g)/7);
                "fixed"==n("weekMode")&&(l(m,7*(6-_)),_=6),
                    s.title=c(u,n("titleFormat")),
                    s.start=u,
                    s.end=p,s.visStart=g,
                    s.visEnd=m,a(_,v,!0)
            }
            var s=this;s.render=i,X.call(s,t,e,"month");
            var n=s.opt,
                a=s.renderBasic,
                o=s.skipHiddenDays,
                h=s.getCellsPerWeek,c=e.formatDate
        }
        function K(t,e){
            function i(t,e){e&&l(t,7*e);
                var i=l(d(t),-((t.getDay()-n("firstDay")+7)%7)),c=l(d(i),7),u=d(i);o(u);
                var p=d(c);o(p,-1,!0);
                var f=r();s.start=i,s.end=c,s.visStart=u,s.visEnd=p,s.title=h(u,l(d(p),-1),n("titleFormat")),a(1,f,!1)
            }
            var s=this;s.render=i,X.call(s,t,e,"basicWeek");
            var n=s.opt,a=s.renderBasic,o=s.skipHiddenDays,
                r=s.getCellsPerWeek,h=e.formatDates
        }
        function V(t,e){
            function i(t,e){
                e&&l(t,e),o(t,0>e?-1:1);
                var i=d(t,!0),h=l(d(i),1);
                s.title=r(t,n("titleFormat")),s.start=s.visStart=i,s.end=s.visEnd=h,a(1,1,!1)
            }
            var s=this;
            s.render=i,X.call(s,t,e,"basicDay");
            var n=s.opt,a=s.renderBasic,o=s.skipHiddenDays,r=e.formatDate
        }
        function X(e,i,s){
            function n(t,e,i){ee=t,ie=e,se=i,a(),B||o(),r()
            }
            function a(){
                le=fe("theme")?"ui":"fc",he=fe("columnFormat"),
                    ce=fe("weekNumbers"),de=fe("weekNumberTitle"),
                    pe="iso"!=fe("weekNumberCalculation")?"w":"W"
            }
            function o(){
                X=t("<div class='fc-event-container' style='position:absolute;z-index:8;top:0;left:0'/>").appendTo(e)
            }
            function r(){
                var i=h();F&&F.remove(),F=t(i).appendTo(e),O=F.find("thead"),R=O.find(".fc-day-header"),
                    B=F.find("tbody"),$=B.find("tr"),q=B.find(".fc-day"),U=$.find("td:first-child"),
                    K=$.eq(0).find(".fc-day > div"),V=$.eq(0).find(".fc-day-content > div"),
                    Y(O.add(O.find("tr"))),
                    Y($),$.eq(0).addClass("fc-first"),
                    $.filter(":last").addClass("fc-last"),
                    q.each(function(e,i){
                        var s=xe(Math.floor(e/ie),e%ie);
                        ge("dayRender",W,s,t(i))}),_(q)
            }
            function h(){
                var t="<table class='fc-border-separate' style='width:100%' cellspacing='0'>"+c()+p()+"</table>";return t
            }
            function c(){
                var t,e,i=le+"-widget-header",s="";
                for(s+="<thead><tr>",ce&&(s+="<th class='fc-week-number "+i+"'>"+L(de)+"</th>"),
                        t=0;ie>t;t++)e=xe(0,t),s+="<th class='fc-day-header fc-"+Ie[e.getDay()]+" "+i+"'>"+L(Te(e,he))+"</th>";
                return s+="</tr></thead>"
            }
            function p(){
                var t,e,i,s=le+"-widget-content",n="";
                for(n+="<tbody>",t=0;ee>t;t++){
                    for(n+="<tr class='fc-week'>",ce&&(i=xe(t,0),n+="<td class='fc-week-number "+s+"'><div>"+L(Te(i,pe))+"</div></td>"),
                            e=0;ie>e;e++)i=xe(t,e),n+=f(i);n+="</tr>"}return n+="</tbody>"
            }
            function f(t){
                var e=le+"-widget-content",i=W.start.getMonth(),
                    s=u(new Date),n="",a=["fc-day","fc-"+Ie[t.getDay()],e];
                return t.getMonth()!=i&&a.push("fc-other-month"),
                    +t==+s?a.push("fc-today",le+"-state-highlight"):s>t?a.push("fc-past"):a.push("fc-future"),
                    n+="<td class='"+a.join(" ")+"' data-date='"+Te(t,"yyyy-MM-dd")+"'><div>",
                se&&(n+="<div class='fc-day-number'>"+t.getDate()+"</div>"),
                    n+="<div class='fc-day-content'><div style='position:relative'>&nbsp;</div></div></div></td>"
            }
            function g(e){
                J=e;
                var i,s,n,a=J-O.height();
                "variable"==fe("weekMode")?i=s=Math.floor(a/(1==ee?2:6)):(i=Math.floor(a/ee),s=a-i*(ee-1)),U.each(
                    function(e,a){
                        ee>e&&(n=t(a),n.find("> div").css("min-height",(e==ee-1?s:i)-E(n)))
                    }
                )}
            function m(t){
                G=t,oe.clear(),re.clear(),
                    te=0,ce&&(te=O.find("th.fc-week-number").outerWidth()),
                    Z=Math.floor((G-te)/ie),k(R.slice(0,-1),Z)
            }
            function _(t){
                t.click(b).mousedown(Ce)
            }
            function b(e){
                if(!fe("selectable")){
                    var i=v(t(this).data("date"));
                    ge("dayClick",this,i,!0,e)
                }
            }
            function y(t,e,i){
                i&&ne.build();
                for(var s=Me(t,e),n=0;n<s.length;n++){
                    var a=s[n];_(w(a.row,a.leftCol,a.row,a.rightCol))
                }
            }
            function w(t,i,s,n){
                var a=ne.rect(t,i,s,n,e);
                return ye(a,e)}function D(t){return d(t)
            }
            function C(t,e){y(t,l(d(e),1),!0)}
            function x(){De()}
            function M(t,e,i){var s=ke(t),n=q[s.row*ie+s.col];ge("dayClick",n,t,e,i)}
            function T(t,e){ae.start(function(t){De(),t&&w(t.row,t.col,t.row,t.col)},e)}
            function I(t,e,i){var s=ae.stop();if(De(),s){var n=xe(s);ge("drop",t,n,!0,e,i)}}
            function P(t){return d(t.start)}
            function S(t){return oe.left(t)}
            function z(t){return oe.right(t)}
            function H(t){return re.left(t)}
            function A(t){return re.right(t)}
            function N(t){return $.eq(t)}
            var W=this;W.renderBasic=n,W.setHeight=g,W.setWidth=m,W.renderDayOverlay=y,W.defaultSelectionEnd=D,W.renderSelection=C,W.clearSelection=x,W.reportDayClick=M,W.dragStart=T,W.dragStop=I,W.defaultEventEnd=P,
                W.getHoverListener=function(){return ae},
                W.colLeft=S,W.colRight=z,W.colContentLeft=H,W.colContentRight=A,
                W.getIsCellAllDay=function(){return!0},
                W.allDayRow=N,W.getRowCnt=function(){return ee},
                W.getColCnt=function(){return ie},W.getColWidth=function(){return Z},
                W.getDaySegmentContainer=function(){return X},ue.call(W,e,i,s),ve.call(W),me.call(W),Q.call(W);
            var F,O,R,B,$,q,U,K,V,X,G,J,Z,te,ee,ie,se,ne,ae,oe,re,le,he,ce,de,pe,
                fe=W.opt,ge=W.trigger,ye=W.renderOverlay,De=W.clearOverlays,
                Ce=W.daySelectionMousedown,xe=W.cellToDate,ke=W.dateToCell,
                Me=W.rangeToSegments,Te=i.formatDate;j(e.addClass("fc-grid")),
                ne=new _e(function(e,i){var s,n,a;R.each(function(e,o){s=t(o),n=s.offset().left,e&&(a[1]=n),a=[n],i[e]=a}),a[1]=n+s.outerWidth(),
                    $.each(function(i,o){ee>i&&(s=t(o),n=s.offset().top,i&&(a[1]=n),a=[n],e[i]=a)})
                    ,a[1]=n+s.outerHeight()}),
                ae=new be(ne),
                oe=new we(function(t){return K.eq(t)}),
                re=new we(function(t){return V.eq(t)})
        }
        function Q(){
            function t(t,e){i.renderDayEvents(t,e)}
            function e(){i.getDaySegmentContainer().empty()}
            var i=this;
            i.renderEvents=t,
                i.clearEvents=e,de.call(i)
        }
        function G(t,e){
            function i(t,e){e&&l(t,7*e);
                var i=l(d(t),-((t.getDay()-n("firstDay")+7)%7)),c=l(d(i),7),u=d(i);o(u);
                var p=d(c);o(p,-1,!0);
                var f=r();
                s.title=h(u,l(d(p),-1),n("titleFormat")), s.start=i,s.end=c,s.visStart=u,s.visEnd=p,a(f)
            }
            var s=this;s.render=i,Z.call(s,t,e,"agendaWeek");
            var n=s.opt,a=s.renderAgenda,o=s.skipHiddenDays,
                r=s.getCellsPerWeek,h=e.formatDates
        }
        function J(t,e){
            function i(t,e){
                e&&l(t,e),o(t,0>e?-1:1);
                var i=d(t,!0),h=l(d(i),1);
                s.title=r(t,n("titleFormat")),s.start=s.visStart=i,s.end=s.visEnd=h,a(1)

            }
            var s=this;
            s.render=i,Z.call(s,t,e,"agendaDay");
            var n=s.opt,a=s.renderAgenda,o=s.skipHiddenDays,r=e.formatDate
        }
        function Z(i,s,n){
            function a(t){Ae=t,o(),Z?h():r()}
            function o(){
                Le=Ve("theme")?"ui":"fc",je=Ve("isRTL"),
                    Ye=_(Ve("minTime")),Be=_(Ve("maxTime")),
                    $e=Ve("columnFormat"),qe=Ve("weekNumbers"),
                    Ue=Ve("weekNumberTitle"),
                    Ke="iso"!=Ve("weekNumberCalculation")?"w":"W",
                    Ee=Ve("snapMinutes")||Ve("slotMinutes")
            }
            function r(){

                var e,s,n,a,o,r=Le+"-widget-header",
                    l=Le+"-widget-content",
                    u=Ve("slotMinutes")%15==0;
                for(h(),
                        he=t("<div style='position:absolute;z-index:2;left:0;width:100%'/>").appendTo(i),
                        Ve("allDaySlot")?
                            (ce=t("<div class='fc-event-container' style='position:absolute;z-index:8;top:0;left:0'/>").appendTo(he),
                                e="<table style='width:100%' class='fc-agenda-allday' cellspacing='0'><tr><th class='"+r+" fc-agenda-axis'>"+Ve("allDayText")+"</th><td><div class='fc-day-content'><div style='position:relative'/></div></td><th class='"+r+" fc-agenda-gutter'>&nbsp;</th></tr></table>",
                                de=t(e).appendTo(he),pe=de.find("tr"),D(pe.find("td")),he.append("<div class='fc-agenda-divider "+r+"'><div class='fc-agenda-divider-inner'/></div>")):ce=t([]),
                        fe=t("<div style='position:absolute;width:100%;overflow-x:hidden;overflow-y:auto'/>").appendTo(he),ge=t("<div style='position:relative;width:100%;overflow:hidden'/>").appendTo(fe),ye=t("<div class='fc-event-container' style='position:absolute;z-index:8;top:0;left:0'/>").appendTo(ge),e="<table class='fc-agenda-slots' style='width:100%' cellspacing='0'><tbody>",s=p(),a=c(d(s),Be),c(s,Ye),Ne=0,n=0;a>s;n++)o=s.getMinutes(),e+="<tr class='fc-slot"+n+" "+(o?"fc-minor":"")+"'><th class='fc-agenda-axis "+r+"'>"+(u&&o?"&nbsp;":ai(s,Ve("axisFormat")))+"</th><td class='"+l+"'><div style='position:relative'>&nbsp;</div></td></tr>",c(s,Ve("slotMinutes")),Ne++;e+="</tbody></table>",De=t(e).appendTo(ge),
                    C(De.find("td"))
            }

            function h(){var e=f();Z&&Z.remove(),Z=t(e).appendTo(i),ee=Z.find("thead"),ie=ee.find("th").slice(1,-1),se=Z.find("tbody"),ne=se.find("td").slice(0,-1),ae=ne.find("> div"),oe=ne.find(".fc-day-content > div"),re=ne.eq(0),le=ae.eq(0),Y(ee.add(ee.find("tr"))),Y(se.add(se.find("tr")))
            }
            function f(){var t="<table style='width:100%' class='fc-agenda-days fc-border-separate' cellspacing='0'>"+g()+m()+"</table>";return t}
            function g(){var t,e,i,s=Le+"-widget-header",n="";for(n+="<thead><tr>",qe?(t=ii(0,0),e=ai(t,Ke),je?e+=Ue:e=Ue+e,n+="<th class='fc-agenda-axis fc-week-number "+s+"'>"+L(e)+"</th>"):n+="<th class='fc-agenda-axis "+s+"'>&nbsp;</th>",i=0;Ae>i;i++)t=ii(0,i),n+="<th class='fc-"+Ie[t.getDay()]+" fc-col"+i+" "+s+"'>"+L(ai(t,$e))+"</th>";return n+="<th class='fc-agenda-gutter "+s+"'>&nbsp;</th></tr></thead>"}
            function m(){var t,e,i,s,n,a=Le+"-widget-header",o=Le+"-widget-content",r=u(new Date),l="";for(l+="<tbody><tr><th class='fc-agenda-axis "+a+"'>&nbsp;</th>",i="",e=0;Ae>e;e++)t=ii(0,e),
                n=["fc-col"+e,"fc-"+Ie[t.getDay()],o],+t==+r?n.push(Le+"-state-highlight","fc-today"):r>t?n.push("fc-past"):n.push("fc-future"),
                s="<td class='"+n.join(" ")+"'><div><div class='fc-day-content'><div style='position:relative'>&nbsp;</div></div></div></td>",
                i+=s;return l+=i,l+="<td class='fc-agenda-gutter "+o+"'>&nbsp;</td></tr></tbody>"

            }
            function v(t){t===e&&(t=ke),ke=t,oi={};var i=se.position().top,s=fe.position().top,
                n=Math.min(t-i,De.height()+s+1);le.height(n-E(re)),he.css("top",i),
                fe.height(n-s-1),Se=De.find("tr:first").height()+1,ze=Ve("slotMinutes")/Ee,He=Se/ze
            }
            function b(e){xe=e,Oe.clear(),Re.clear();var i=ee.find("th:first");de&&(i=i.add(de.find("th:first"))),
                i=i.add(De.find("th:first")),
                Me=0,k(i.width("").each(function(e,i){
                Me=Math.max(Me,t(i).outerWidth())}),Me);
                var s=Z.find(".fc-agenda-gutter");
                de&&(s=s.add(de.find("th.fc-agenda-gutter")));
                var n=fe[0].clientWidth;Pe=fe.width()-n,Pe?(k(s,Pe),
                    s.show().prev().removeClass("fc-last")):s.hide().prev().addClass("fc-last"),
                    Te=Math.floor((n-Me)/Ae),k(ie.slice(0,-1),Te)
            }
            function y(){function t(){fe.scrollTop(s)}var e=p(),i=d(e);i.setHours(Ve("firstHour"));
                var s=O(e,i)+1;t(),setTimeout(t,0)
            }
            function w(){y()}function D(t){t.click(x).mousedown(ti)}function C(t){t.click(x).mousedown(V)}function x(t){if(!Ve("selectable")){var e=Math.min(Ae-1,Math.floor((t.pageX-Z.offset().left-Me)/Te)),i=ii(0,e),s=this.parentNode.className.match(/fc-slot(\d+)/);if(s){var n=parseInt(s[1])*Ve("slotMinutes"),a=Math.floor(n/60);i.setHours(a),i.setMinutes(n%60+Ye),Xe("dayClick",ne[e],i,!1,t)}else Xe("dayClick",ne[e],i,!0,t)}}function T(t,e,i){i&&We.build();for(var s=ni(t,e),n=0;n<s.length;n++){var a=s[n];D(I(a.row,a.leftCol,a.row,a.rightCol))}}function I(t,e,i,s){var n=We.rect(t,e,i,s,he);return Qe(n,he)}function P(t,e){for(var i=0;Ae>i;i++){var s=ii(0,i),n=l(d(s),1),a=new Date(Math.max(s,t)),o=new Date(Math.min(n,e));if(o>a){var r=We.rect(0,i,0,i,ge),h=O(s,a),c=O(s,o);r.top=h,r.height=c-h,C(Qe(r,ge))}}}function S(t){return Oe.left(t)}function z(t){return Re.left(t)}function H(t){return Oe.right(t)}function A(t){return Re.right(t)}function N(t){return Ve("allDaySlot")&&!t.row}function F(t){var e=ii(0,t.col),i=t.row;return Ve("allDaySlot")&&i--,i>=0&&c(e,Ye+i*Ee),e}function O(t,i){if(t=d(t,!0),i<c(d(t),Ye))return 0;if(i>=c(d(t),Be))return De.height();var s=Ve("slotMinutes"),n=60*i.getHours()+i.getMinutes()-Ye,a=Math.floor(n/s),o=oi[a];return o===e&&(o=oi[a]=De.find("tr").eq(a).find("td div")[0].offsetTop),Math.max(0,Math.round(o-1+Se*(n%s/s)))}function R(){return pe}function B(t){var e=d(t.start);return t.allDay?e:c(e,Ve("defaultEventMinutes"))}function $(t,e){return e?d(t):c(d(t),Ve("slotMinutes"))}function q(t,e,i){i?Ve("allDaySlot")&&T(t,l(d(e),1),!0):U(t,e)}function U(e,i){var s=Ve("selectHelper");if(We.build(),s){var n=si(e).col;if(n>=0&&Ae>n){var a=We.rect(0,n,0,n,ge),o=O(e,e),r=O(e,i);if(r>o){if(a.top=o,a.height=r-o,a.left+=2,a.width-=5,t.isFunction(s)){var l=s(e,i);l&&(a.position="absolute",Ce=t(l).css(a).appendTo(ge))}else a.isStart=!0,a.isEnd=!0,Ce=t(ei({title:"",start:e,end:i,className:["fc-select-helper"],editable:!1},a)),Ce.css("opacity",Ve("dragOpacity"));Ce&&(C(Ce),ge.append(Ce),k(Ce,a.width,!0),M(Ce,a.height,!0))}}}else P(e,i)}function K(){Ge(),Ce&&(Ce.remove(),Ce=null)}function V(e){if(1==e.which&&Ve("selectable")){Ze(e);var i;Fe.start(function(t,e){if(K(),t&&t.col==e.col&&!N(t)){var s=F(e),n=F(t);i=[s,c(d(s),Ee),n,c(d(n),Ee)].sort(W),U(i[0],i[3])}else i=null},e),t(document).one("mouseup",function(t){Fe.stop(),i&&(+i[0]==+i[1]&&X(i[0],!1,t),Je(i[0],i[3],!1,t))})}}function X(t,e,i){Xe("dayClick",ne[si(t).col],t,e,i)}function Q(t,e){Fe.start(function(t){if(Ge(),t)if(N(t))I(t.row,t.col,t.row,t.col);else{var e=F(t),i=c(d(e),Ve("defaultEventMinutes"));P(e,i)}},e)}function G(t,e,i){var s=Fe.stop();Ge(),s&&Xe("drop",t,F(s),N(s),e,i)}var J=this;J.renderAgenda=a,J.setWidth=b,J.setHeight=v,J.afterRender=w,J.defaultEventEnd=B,J.timePosition=O,J.getIsCellAllDay=N,J.allDayRow=R,J.getCoordinateGrid=function(){return We},J.getHoverListener=function(){return Fe},J.colLeft=S,J.colRight=H,J.colContentLeft=z,J.colContentRight=A,J.getDaySegmentContainer=function(){return ce

            },
                J.getSlotSegmentContainer=function(){return ye},J.getMinMinute=function(){return Ye},
                J.getMaxMinute=function(){return Be},J.getSlotContainer=function(){return ge},J.getRowCnt=function(){return 1},
                J.getColCnt=function(){return Ae},J.getColWidth=function(){return Te},
                J.getSnapHeight=function(){return He},J.getSnapMinutes=function(){return Ee},
                J.defaultSelectionEnd=$,J.renderDayOverlay=T,J.renderSelection=q,J.clearSelection=K,J.reportDayClick=X,J.dragStart=Q,J.dragStop=G,ue.call(J,i,s,n),ve.call(J),me.call(J),te.call(J);
            var Z,ee,ie,se,ne,ae,oe,re,le,he,ce,de,pe,fe,ge,ye,De,Ce,xe,ke,Me,Te,Pe,Se,Ee,ze,He,Ae,Ne,We,Fe,Oe,Re,Le,je,Ye,Be,$e,qe,Ue,Ke,Ve=J.opt,Xe=J.trigger,Qe=J.renderOverlay,Ge=J.clearOverlays,Je=J.reportSelection,Ze=J.unselect,ti=J.daySelectionMousedown,ei=J.slotSegHtml,ii=J.cellToDate,si=J.dateToCell,ni=J.rangeToSegments,ai=s.formatDate,oi={};
            j(i.addClass("fc-agenda")),
                We=new _e(function(e,i){
                    function s(t){return Math.max(l,Math.min(h,t))
                    }
                    var n,a,o;ie.each(function(e,s){n=t(s),a=n.offset().left,e&&(o[1]=a),o=[a],i[e]=o}),o[1]=a+n.outerWidth(),Ve("allDaySlot")&&(n=pe,a=n.offset().top,e[0]=[a,a+n.outerHeight()]);for(var r=ge.offset().top,l=fe.offset().top,h=l+fe.outerHeight(),c=0;Ne*ze>c;c++)e.push([s(r+He*c),s(r+He*(c+1))])}),Fe=new be(We),Oe=new we(function(t){return ae.eq(t)}),Re=new we(function(t){return oe.eq(t)})}function te(){
            function i(t,e){
                var i,
                    s=t.length,
                    a=[],
                    o=[];
                for(i=0;s>i;i++) {
                    t[i].allDay ? a.push(t[i]) : o.push(t[i]);

                }
                _("allDaySlot")&&(te(a,e),I()),
                    r(n(o),e)
            }
            function s(){P().empty(),S().empty()}
            function n(e){var i,s,n,r,l,h=j(),u=A(),p=H(),f=t.map(e,o),g=[];for(s=0;h>s;s++)for(i=R(0,s),c(i,u),l=a(e,f,i,c(d(i),p-u)),l=ee(l),n=0;n<l.length;n++)r=l[n],r.col=s,g.push(r);return g}
            function a(t,e,i,s){var n,a,o,r,l,h,c,u,p=[],f=t.length;for(n=0;f>n;n++)a=t[n],o=a.start,r=e[n],r>i&&s>o&&(i>o?(l=d(i),c=!1):(l=o,c=!0),r>s?(h=d(s),u=!1):(h=r,u=!0),p.push({event:a,start:l,end:h,isStart:c,isEnd:u}));return p.sort(ce)}function o(t){return t.end?d(t.end):c(d(t.start),_("defaultEventMinutes"))}
            function r(i,s){var n,a,o,r,l,c,d,p,f,g,m,v,y,w,D,C,k=i.length,M="",I=S(),P=_("isRTL");for(n=0;k>n;n++)a=i[n],o=a.event,r=N(a.start,a.start),l=N(a.start,a.end),c=F(a.col),d=O(a.col),p=d-c,d-=.025*p,p=d-c,f=p*(a.forwardCoord-a.backwardCoord),_("slotEventOverlap")&&(f=Math.max(2*(f-10),f)),P?(m=d-a.backwardCoord*p,g=m-f):(g=c+a.backwardCoord*p,m=g+f),g=Math.max(g,c),m=Math.min(m,d),f=m-g,a.top=r,a.left=g,a.outerWidth=f,a.outerHeight=l-r,M+=h(o,a);for(I[0].innerHTML=M,v=I.children(),n=0;k>n;n++)a=i[n],o=a.event,y=t(v[n]),w=b("eventRender",o,o,y),w===!1?y.remove():(w&&w!==!0&&(y.remove(),y=t(w).css({position:"absolute",top:a.top,left:a.left}).appendTo(I)),a.element=y,o._id===s?u(o,y,a):y[0]._fci=n,K(o,y));for(x(I,i,u),n=0;k>n;n++)a=i[n],(y=a.element)&&(a.vsides=E(y,!0),a.hsides=T(y,!0),D=y.find(".fc-event-title"),D.length&&(a.contentTop=D[0].offsetTop));for(n=0;k>n;n++)a=i[n],(y=a.element)&&(y[0].style.width=Math.max(0,a.outerWidth-a.hsides)+"px",C=Math.max(0,a.outerHeight-a.vsides),y[0].style.height=C+"px",o=a.event,
            a.contentTop!==e&&C-a.contentTop<10&&(y.find("div.fc-event-time").text(se(o.start,_("timeFormat"))+" - "+o.title),
                y.find("div.fc-event-title").remove()),b("eventAfterRender",o,o,y))}
            function h(t,e){
                //alert("in H VERT");
                var i="<",s=t.url,n=B(t,_),
                    //a=(n.toLowerCase().indexOf("friend") >= 0)? ["fc-event-friend","fc-event-vert"]: ["fc-event","fc-event-vert"];
                    a=(n.toLowerCase().indexOf("friend") >= 0)? ["fc-event-friend","fc-event-vert"]:(n.toLowerCase().indexOf("invite") >= 0)? ["fc-event-invite","fc-event-vert"]:["fc-event","fc-event-vert"];

                //a=["fc-event","fc-event-vert"];
                return y(t)&&a.push("fc-event-draggable"),
                e.isStart&&a.push("fc-event-start"),
                e.isEnd&&a.push("fc-event-end"),a=a.concat(t.className),t.source&&(a=a.concat(t.source.className||[])),i+=s?"a href='"+L(t.url)+"'":"div",i+=" class='"+a.join(" ")+"' style='position:absolute;top:"+e.top+"px;left:"+e.left+"px;"+n+"'>" +
                "<div class='fc-event-inner'><div class='fc-event-time'>"+L(ne(t.start,t.end,_("timeFormat")))+"</div><div class='fc-event-title'>"+L(t.title||"")+"</div></div><div class='fc-event-bg'></div>",e.isEnd&&w(t)&&(i+="<div class='ui-resizable-handle ui-resizable-s'>=</div>"),i+="</"+(s?"a":"div")+">"}
            function u(t,e,i){var s=e.find("div.fc-event-time");y(t)&&g(t,e,s),i.isEnd&&w(t)&&m(t,e,s),k(t,e)}
            function p(t,e,i){function s(){h||(e.width(n).height("").draggable("option","grid",null),h=!0)}var n,a,o,r=i.isStart,h=!0,c=z(),u=Y(),p=$(),g=q(),m=A();
                e.draggable({opacity:_("dragOpacity","month"),revertDuration:_("dragRevertDuration"),start:function(i,m){b("eventDragStart",e,t,i,m),X(t,e),n=e.width(),c.start(function(i,n){if(Z(),i){a=!1;var c=R(0,n.col),m=R(0,i.col);o=f(m,c),i.row?r?h&&(e.width(u-10),M(e,p*Math.round((t.end?(t.end-t.start)/Ee:_("defaultEventMinutes"))/g)),e.draggable("option","grid",[u,1]),h=!1):a=!0:(J(l(d(t.start),o),l(D(t),o)),s()),a=a||h&&!o}else s(),a=!0;e.draggable("option","revert",a)},i,"drag")},stop:function(i,n){if(c.stop(),Z(),b("eventDragStop",e,t,i,n),a)s(),e.css("filter",""),V(t,e);
                else{var r=0;h||(r=Math.round((e.offset().top-U().offset().top)/p)*g+m-(60*t.start.getHours()+t.start.getMinutes())),Q(this,t,o,r,h,i,n)}}})}function g(t,e,i){function s(){Z(),r&&(u?(i.hide(),e.draggable("option","grid",null),J(l(d(t.start),y),l(D(t),y))):(n(w),i.css("display",""),e.draggable("option","grid",[M,T])))}function n(e){var s,n=c(d(t.start),e);t.end&&(s=c(d(t.end),e)),i.text(ne(n,s,_("timeFormat")))}var a,o,r,h,u,p,g,m,y,w,C,x=v.getCoordinateGrid(),k=j(),M=Y(),T=$(),I=q();e.draggable({scroll:!1,grid:[M,T],axis:1==k?"y":!1,opacity:_("dragOpacity"),revertDuration:_("dragRevertDuration"),start:function(i,s){b("eventDragStart",e,t,i,s),X(t,e),x.build(),a=e.position(),o=x.cell(i.pageX,i.pageY),r=h=!0,u=p=W(o),g=m=0,y=0,w=C=0},drag:function(t,i){var n=x.cell(t.pageX,t.pageY);if(r=!!n){if(u=W(n),g=Math.round((i.position.left-a.left)/M),g!=m){var l=R(0,o.col),c=o.col+g;c=Math.max(0,c),c=Math.min(k-1,c);var d=R(0,c);y=f(d,l)}u||(w=Math.round((i.position.top-a.top)/T)*I)}(r!=h||u!=p||g!=m||w!=C)&&(s(),h=r,p=u,m=g,C=w),e.draggable("option","revert",!r)},stop:function(i,n){Z(),b("eventDragStop",e,t,i,n),r&&(u||y||w)?Q(this,t,y,u?0:w,u,i,n):(r=!0,u=!1,g=0,y=0,w=0,s(),e.css("filter",""),e.css(a),V(t,e))}})}function m(t,e,i){var s,n,a=$(),o=q();e.resizable({handles:{s:".ui-resizable-handle"},grid:a,start:function(i,a){s=n=0,X(t,e),b("eventResizeStart",this,t,i,a)},
                resize:function(r,l){s=Math.round((Math.max(a,e.height())-l.originalSize.height)/a),s!=n&&(i.text(ne(t.start,s||t.end?c(C(t),o*s):null,_("timeFormat"))),n=s)},stop:function(i,n){b("eventResizeStop",this,t,i,n),s?G(this,t,0,o*s,i,n):V(t,e)}})}var v=this;v.renderEvents=i,v.clearEvents=s,v.slotSegHtml=h,de.call(v);var _=v.opt,b=v.trigger,y=v.isEventDraggable,w=v.isEventResizable,C=v.eventEnd,k=v.eventElementHandlers,I=v.setHeight,P=v.getDaySegmentContainer,S=v.getSlotSegmentContainer,z=v.getHoverListener,H=v.getMaxMinute,A=v.getMinMinute,N=v.timePosition,W=v.getIsCellAllDay,F=v.colContentLeft,O=v.colContentRight,R=v.cellToDate,j=v.getColCnt,Y=v.getColWidth,$=v.getSnapHeight,q=v.getSnapMinutes,U=v.getSlotContainer,K=v.reportEventElement,V=v.showEvents,X=v.hideEvents,Q=v.eventDrop,G=v.eventResize,J=v.renderDayOverlay,Z=v.clearOverlays,te=v.renderDayEvents,ie=v.calendar,se=ie.formatDate,ne=ie.formatDates;v.draggableDayEvent=p}function ee(t){var e,i=ie(t),s=i[0];if(se(i),s){for(e=0;e<s.length;e++)ne(s[e]);for(e=0;e<s.length;e++)ae(s[e],0,0)}return oe(i)}function ie(t){var e,i,s,n=[];for(e=0;e<t.length;e++){for(i=t[e],s=0;s<n.length&&re(i,n[s]).length;s++);(n[s]||(n[s]=[])).push(i)}return n}function se(t){var e,i,s,n,a;for(e=0;e<t.length;e++)for(i=t[e],s=0;s<i.length;s++)for(n=i[s],n.forwardSegs=[],a=e+1;a<t.length;a++)re(n,t[a],n.forwardSegs)}function ne(t){var i,s,n=t.forwardSegs,a=0;if(t.forwardPressure===e){for(i=0;i<n.length;i++)s=n[i],ne(s),a=Math.max(a,1+s.forwardPressure);t.forwardPressure=a}}function ae(t,i,s){var n,a=t.forwardSegs;if(t.forwardCoord===e)for(a.length?(a.sort(he),ae(a[0],i+1,s),t.forwardCoord=a[0].backwardCoord):t.forwardCoord=1,t.backwardCoord=t.forwardCoord-(t.forwardCoord-s)/(i+1),n=0;n<a.length;n++)ae(a[n],0,t.forwardCoord)}function oe(t){var e,i,s,n=[];for(e=0;e<t.length;e++)for(i=t[e],s=0;s<i.length;s++)n.push(i[s]);return n}function re(t,e,i){i=i||[];for(var s=0;s<e.length;s++)le(t,e[s])&&i.push(e[s]);return i}function le(t,e){return t.end>e.start&&t.start<e.end}function he(t,e){return e.forwardPressure-t.forwardPressure||(t.backwardCoord||0)-(e.backwardCoord||0)||ce(t,e)}function ce(t,e){return t.start-e.start||e.end-e.start-(t.end-t.start)||(t.event.title||"").localeCompare(e.event.title)}function ue(i,s,n){function a(e,i){var s=K[e];return t.isPlainObject(s)?R(s,i||n):s}function o(t,e){return s.trigger.apply(s,[t,e||O].concat(Array.prototype.slice.call(arguments,2),[O]))}function r(t){var e=t.source||{};return q(t.startEditable,e.startEditable,a("eventStartEditable"),t.editable,e.editable,a("editable"))&&!a("disableDragging")}function h(t){var e=t.source||{};return q(t.durationEditable,e.durationEditable,a("eventDurationEditable"),t.editable,e.editable,a("editable"))&&!a("disableResizing")}function u(t){B={};var e,i,s=t.length;for(e=0;s>e;e++)i=t[e],B[i._id]?B[i._id].push(i):B[i._id]=[i]}function p(){B={},$={},U=[]}function g(t){return t.end?d(t.end):L(t)}function m(t,e){U.push({event:t,element:e}),$[t._id]?$[t._id].push(e):$[t._id]=[e]}function v(){t.each(U,function(t,e){O.trigger("eventDestroy",e.event,e.event,e.element)})}function _(t,e){e.click(function(i){return e.hasClass("ui-draggable-dragging")||e.hasClass("ui-resizable-resizing")?void 0:o("eventClick",this,t,i)}).hover(function(e){o("eventMouseover",this,t,e)},function(e){o("eventMouseout",this,t,e)})}function b(t,e){w(t,e,"show")}function y(t,e){w(t,e,"hide")}function w(t,e,i){var s,n=$[t._id],a=n.length;for(s=0;a>s;s++)e&&n[s][0]==e[0]||n[s][i]()}function D(t,e,i,s,n,a,r){var l=e.allDay,h=e._id;x(B[h],i,s,n),o("eventDrop",t,e,i,s,n,function(){x(B[h],-i,-s,l),Y(h)},a,r),Y(h)}function C(t,e,i,s,n,a){var r=e._id;k(B[r],i,s),o("eventResize",t,e,i,s,function(){k(B[r],-i,-s),Y(r)},n,a),Y(r)}function x(t,i,s,n){s=s||0;for(var a,o=t.length,r=0;o>r;r++)a=t[r],n!==e&&(a.allDay=n),c(l(a.start,i,!0),s),a.end&&(a.end=c(l(a.end,i,!0),s)),j(a,K)}function k(t,e,i){i=i||0;for(var s,n=t.length,a=0;n>a;a++)s=t[a],s.end=c(l(g(s),e,!0),i),j(s,K)}function M(t){return"object"==typeof t&&(t=t.getDay()),Q[t]}function T(){return V}function I(t,e,i){for(e=e||1;Q[(t.getDay()+(i?e:0)+7)%7];)l(t,e)}function P(){var t=S.apply(null,arguments),e=E(t),i=z(e);return i}function S(t,e){var i=O.getColCnt(),s=Z?-1:1,n=Z?i-1:0;"object"==typeof t&&(e=t.col,t=t.row);var a=t*i+(e*s+n);return a}function E(t){var e=O.visStart.getDay();return t+=G[e],7*Math.floor(t/V)+J[(t%V+V)%V]-e}function z(t){var e=d(O.visStart);return l(e,t),e}function H(t){var e=A(t),i=N(e),s=W(i);return s}function A(t){return f(t,O.visStart)}function N(t){var e=O.visStart.getDay();return t+=e,Math.floor(t/7)*V+G[(t%7+7)%7]-G[e]}function W(t){var e=O.getColCnt(),i=Z?-1:1,s=Z?e-1:0,n=Math.floor(t/e),a=(t%e+e)%e*i+s;return{row:n,col:a}}function F(t,e){for(var i=O.getRowCnt(),s=O.getColCnt(),n=[],a=A(t),o=A(e),r=N(a),l=N(o)-1,h=0;i>h;h++){var c=h*s,u=c+s-1,d=Math.max(r,c),p=Math.min(l,u);if(p>=d){var f=W(d),g=W(p),m=[f.col,g.col].sort(),v=E(d)==a,_=E(p)+1==o;n.push({row:h,leftCol:m[0],rightCol:m[1],isStart:v,isEnd:_})}}return n}var O=this;O.element=i,O.calendar=s,O.name=n,O.opt=a,O.trigger=o,O.isEventDraggable=r,O.isEventResizable=h,O.setEventData=u,O.clearEventData=p,O.eventEnd=g,O.reportEventElement=m,O.triggerEventDestroy=v,O.eventElementHandlers=_,O.showEvents=b,O.hideEvents=y,O.eventDrop=D,O.eventResize=C;var L=O.defaultEventEnd,j=s.normalizeEvent,Y=s.reportEventChange,B={},$={},U=[],K=s.options;O.isHiddenDay=M,O.skipHiddenDays=I,O.getCellsPerWeek=T,O.dateToCell=H,O.dateToDayOffset=A,O.dayOffsetToCellOffset=N,O.cellOffsetToCell=W,O.cellToDate=P,O.cellToCellOffset=S,O.cellOffsetToDayOffset=E,O.dayOffsetToDate=z,O.rangeToSegments=F;var V,X=a("hiddenDays")||[],Q=[],G=[],J=[],Z=a("isRTL");!function(){a("weekends")===!1&&X.push(0,6);for(var e=0,i=0;7>e;e++)G[e]=i,Q[e]=-1!=t.inArray(e,X),Q[e]||(J[i]=e,i++);if(V=i,!V)throw"invalid hiddenDays"}()}function de(){function e(t,e){var i=s(t,!1,!0);fe(i,function(t,e){z(t.event,e)}),b(i,e),fe(i,function(t,e){I("eventAfterRender",t.event,t.event,e)})}function i(t,e,i){var n=s([t],!0,!1),a=[];return fe(n,function(t,s){t.row===e&&s.css("top",i),a.push(s[0])}),a}function s(e,i,s){var a,l,h=X(),d=i?t("<div/>"):h,p=n(e);return o(p),a=r(p),d[0].innerHTML=a,l=d.children(),i&&h.append(l),c(p,l),fe(p,function(t,e){t.hsides=T(e,!0)}),fe(p,function(t,e){e.width(Math.max(0,t.outerWidth-t.hsides))}),fe(p,function(t,e){t.outerHeight=e.outerHeight(!0)}),u(p,s),p}function n(t){for(var e=[],i=0;i<t.length;i++){var s=a(t[i]);e.push.apply(e,s)}return e}function a(t){for(var e=t.start,i=D(t),s=ee(e,i),n=0;n<s.length;n++)s[n].event=t;return s}function o(t){for(var e=M("isRTL"),i=0;i<t.length;i++){var s=t[i],n=(e?s.isEnd:s.isStart)?K:q,a=(e?s.isStart:s.isEnd)?V:U,o=n(s.leftCol),r=a(s.rightCol);s.left=o,s.outerWidth=r-o}}function r(t){for(var e="",i=0;i<t.length;i++)e+=h(t[i]);return e}
            function h(t){
                //alert("in H HORIZ");

                console.log("EVENT TITLE === "+JSON.stringify(t.event) );
                //console.log("EVENT TITLE === "+t.event.end );
                //var new_end = new Date(new Date(t.event.end_date_time).valueOf()+ new Date(t.event.end_date_time).getTimezoneOffset() * 60000);
                //var new_end_2 = new Date(new Date(t.event.end).valueOf()+ new Date(t.event.end).getTimezoneOffset() * 60000);
                //
                //var new_start = new Date(t.event.start.valueOf() + t.event.start.getTimezoneOffset() * 60000);
                var new_end =  new Date();
                new_end.setTime(t.event.start.getTime());



                new_end.setMinutes(new_end.getMinutes() + parseInt(t.event.duration));

                //console.log("EVENT TITLE END === "+(t.event.end)+" END DATE=== "+(t.event.end_date_time) + " NEW END "+new_end+ " NEW END 2 "+new_end_2 + " START "+t.event.start);
                //console.log("START "+ t.start+"ENDS "+ t.end);
                console.log("EVENT TITLE NEW START=== "+t.event.start +"  NEW END  "+new_end+ " DURATION "+parseInt(t.event.duration));
                var e="",i=M("isRTL"),
                    s=t.event,n=s.url,

                    a=(n.toLowerCase().indexOf("friend") >= 0)? ["fc-event-friend","fc-event-hori"]:(n.toLowerCase().indexOf("invite") >= 0)? ["fc-event-invite","fc-event-hori"]:["fc-event","fc-event-hori"];

                P(s)&&a.push("fc-event-draggable"),
                t.isStart&&a.push("fc-event-start"),
                t.isEnd&&a.push("fc-event-end"),
                    a=a.concat(s.className),
                s.source&&(a=a.concat(s.source.className||[]));
                var o=B(s,M);
                return e+=n?"<a href='"+L(n)+"'":"<div",e+=" class='"+a.join(" ")+"' style='position:absolute;left:"+t.left+"px;"+o+"'>" +
                "<div class='fc-event-inner'>",!s.allDay&&t.isStart&&(e+="<span class='fc-event-time'>"+L(Q(s.start, new_end,M("timeFormat")))+"</span>"),e+="<span class='fc-event-title'>"+L(s.title||"")+"</span></div>",t.isEnd&&S(s)&&(e+="<div class='ui-resizable-handle ui-resizable-"+(i?"w":"e")+"'>&nbsp;&nbsp;&nbsp;</div>"),e+="</"+(n?"a":"div")+">"}
            function c(e,i){for(var s=0;s<e.length;s++){var n=e[s],a=n.event,o=i.eq(s),r=I("eventRender",a,a,o);r===!1?o.remove():(r&&r!==!0&&(r=t(r).css({position:"absolute",left:n.left}),o.replaceWith(r),o=r),n.element=o)}}function u(t,e){var i=p(t),s=_(),n=[];if(e)for(var a=0;a<s.length;a++)s[a].height(i[a]);for(var a=0;a<s.length;a++)n.push(s[a].position().top);fe(t,function(t,e){e.css("top",n[t.row]+t.top)})}function p(t){for(var e=R(),i=Y(),s=[],n=g(t),a=0;e>a;a++){for(var o=n[a],r=[],l=0;i>l;l++)r.push(0);for(var h=0;h<o.length;h++){var c=o[h];c.top=F(r.slice(c.leftCol,c.rightCol+1));for(var l=c.leftCol;l<=c.rightCol;l++)r[l]=c.top+c.outerHeight}s.push(F(r))}return s}function g(t){var e,i,s,n=R(),a=[];for(e=0;e<t.length;e++)i=t[e],s=i.row,i.element&&(a[s]?a[s].push(i):a[s]=[i]);for(s=0;n>s;s++)a[s]=m(a[s]||[]);return a}function m(t){for(var e=[],i=v(t),s=0;s<i.length;s++)e.push.apply(e,i[s]);return e}function v(t){t.sort(ge);for(var e=[],i=0;i<t.length;i++){for(var s=t[i],n=0;n<e.length&&pe(s,e[n]);n++);e[n]?e[n].push(s):e[n]=[s]}return e}
            function _(){
                var t,e=R(),i=[];
                for(t=0;e>t;t++)i[t]=$(t).find("div.fc-day-content > div");
                return i
            }
            function b(t,e){var i=X();fe(t,function(t,i,s){var n=t.event;n._id===e?y(n,i,t):i[0]._fci=s}),x(i,t,y)}function y(t,e,i){P(t)&&k.draggableDayEvent(t,e,i),i.isEnd&&S(t)&&k.resizableDayEvent(t,e,i),H(t,e)}function w(t,e){var i,s=te();e.draggable({delay:50,opacity:M("dragOpacity"),revertDuration:M("dragRevertDuration"),start:function(n,a){I("eventDragStart",e,t,n,a),N(t,e),s.start(function(s,n,a,o){if(e.draggable("option","revert",!s||!a&&!o),J(),s){var r=ie(n),h=ie(s);i=f(h,r),G(l(d(t.start),i),l(D(t),i))}else i=0},n,"drag")},stop:function(n,a){s.stop(),J(),I("eventDragStop",e,t,n,a),i?W(this,t,i,0,t.allDay,n,a):(e.css("filter",""),A(t,e))
        }
        })
        }
            function C(e,s,n){var a=M("isRTL"),o=a?"w":"e",r=s.find(".ui-resizable-"+o),h=!1;j(s),
                s.mousedown(function(t){t.preventDefault()}).click(function(t){h&&(t.preventDefault(),t.stopImmediatePropagation())}),r.mousedown(function(a){function r(i){I("eventResizeStop",this,e,i),t("body").css("cursor",""),d.stop(),J(),c&&O(this,e,c,0,i),setTimeout(function(){h=!1},0)}if(1==a.which){h=!0;var c,u,d=te(),p=(R(),Y(),s.css("top")),f=t.extend({},e),g=oe(ae(e.start));Z(),t("body").css("cursor",o+"-resize").one("mouseup",r),I("eventResizeStart",this,e,a),d.start(function(s,a){if(s){var r=se(a),h=se(s);if(h=Math.max(h,g),c=ne(h)-ne(r)){f.end=l(E(e),c,!0);var d=u;u=i(f,n.row,p),u=t(u),u.find("*").css("cursor",o+"-resize"),d&&d.remove(),N(e)}else u&&(A(e),u.remove(),u=null);J(),G(e.start,l(D(e),c))}},a)}})}
            var k=this;
            k.renderDayEvents=e,
                k.draggableDayEvent=w,
                k.resizableDayEvent=C;var M=k.opt,I=k.trigger,P=k.isEventDraggable,S=k.isEventResizable,E=k.eventEnd,z=k.reportEventElement,H=k.eventElementHandlers,A=k.showEvents,N=k.hideEvents,W=k.eventDrop,O=k.eventResize,R=k.getRowCnt,Y=k.getColCnt,$=(k.getColWidth,k.allDayRow),q=k.colLeft,U=k.colRight,K=k.colContentLeft,V=k.colContentRight,X=(k.dateToCell,k.getDaySegmentContainer),
                Q=k.calendar.formatDates,G=k.renderDayOverlay,J=k.clearOverlays,Z=k.clearSelection,te=k.getHoverListener,ee=k.rangeToSegments,ie=k.cellToDate,se=k.cellToCellOffset,ne=k.cellOffsetToDayOffset,ae=k.dateToDayOffset,oe=k.dayOffsetToCellOffset
        }
        function pe(t,e){for(var i=0;i<e.length;i++){var s=e[i];if(s.leftCol<=t.rightCol&&s.rightCol>=t.leftCol)return!0}return!1}
        function fe(t,e){for(var i=0;i<t.length;i++){var s=t[i],n=s.element;n&&e(s,n,i)}}
        function ge(t,e){return e.rightCol-e.leftCol-(t.rightCol-t.leftCol)||e.event.allDay-t.event.allDay||t.event.start-e.event.start||(t.event.title||"").localeCompare(e.event.title)}
        function me(){function e(t,e,n){i(),e||(e=l(t,n)),h(t,e,n),s(t,e,n)}function i(t){u&&(u=!1,c(),r("unselect",null,t))}function s(t,e,i,s){u=!0,r("select",null,t,e,i,s)}function n(e){var n=a.cellToDate,r=a.getIsCellAllDay,l=a.getHoverListener(),u=a.reportDayClick;if(1==e.which&&o("selectable")){i(e);var d;l.start(function(t,e){c(),t&&r(t)?(d=[n(e),n(t)].sort(W),h(d[0],d[1],!0)):d=null},e),t(document).one("mouseup",function(t){l.stop(),d&&(+d[0]==+d[1]&&u(d[0],!0,t),s(d[0],d[1],!0,t))})}}var a=this;a.select=e,a.unselect=i,a.reportSelection=s,a.daySelectionMousedown=n;var o=a.opt,r=a.trigger,l=a.defaultSelectionEnd,h=a.renderSelection,c=a.clearSelection,u=!1;o("selectable")&&o("unselectAuto")&&t(document).mousedown(function(e){var s=o("unselectCancel");s&&t(e.target).parents(s).length||i(e)})}function ve(){function e(e,i){var s=a.shift();return s||(s=t("<div class='fc-cell-overlay' style='position:absolute;z-index:3'/>")),s[0].parentNode!=i[0]&&s.appendTo(i),n.push(s.css(e).show()),s}function i(){for(var t;t=n.shift();)a.push(t.hide().unbind())}var s=this;s.renderOverlay=e,s.clearOverlays=i;var n=[],a=[]}function _e(t){var e,i,s=this;s.build=function(){e=[],i=[],t(e,i)},s.cell=function(t,s){var n,a=e.length,o=i.length,r=-1,l=-1;for(n=0;a>n;n++)if(s>=e[n][0]&&s<e[n][1]){r=n;break}for(n=0;o>n;n++)if(t>=i[n][0]&&t<i[n][1]){l=n;break}return r>=0&&l>=0?{row:r,col:l}:null},s.rect=function(t,s,n,a,o){var r=o.offset();return{top:e[t][0]-r.top,left:i[s][0]-r.left,width:i[a][1]-i[s][0],height:e[n][1]-e[t][0]}}}function be(e){function i(t){ye(t);var i=e.cell(t.pageX,t.pageY);(!i!=!o||i&&(i.row!=o.row||i.col!=o.col))&&(i?(a||(a=i),n(i,a,i.row-a.row,i.col-a.col)):n(i,a),o=i)}var s,n,a,o,r=this;r.start=function(r,l,h){n=r,a=o=null,e.build(),i(l),s=h||"mousemove",t(document).bind(s,i)},r.stop=function(){return t(document).unbind(s,i),o}}function ye(t){t.pageX===e&&(t.pageX=t.originalEvent.pageX,t.pageY=t.originalEvent.pageY)}function we(t){function i(e){return n[e]=n[e]||t(e)}var s=this,n={},a={},o={};s.left=function(t){return a[t]=a[t]===e?i(t).position().left:a[t]},s.right=function(t){return o[t]=o[t]===e?s.left(t)+i(t).width():o[t]},s.clear=function(){n={},a={},o={}}}
        var De={
                defaultView:"month",
                aspectRatio:1.35,
                header:{left:"title",
                    center:"",right:"today prev,next"
                },
                weekends:!0,weekNumbers:!1,weekNumberCalculation:"iso",
                weekNumberTitle:"W",allDayDefault:!0,ignoreTimezone:!1,lazyFetching:!0,
                startParam:"start",
                endParam:"end",
                monthParam:"month_view_date",
                titleFormat:{month:"MMMM yyyy",week:"MMM d[ yyyy]{ '&#8212;'[ MMM] d yyyy}",
                    day:"dddd, MMM d, yyyy"},columnFormat:{month:"ddd",week:"ddd M/d",
                    day:"dddd M/d"},
                timeFormat:{"":"h(:mm)t"},isRTL:!1,firstDay:0,
                monthNames:["January","February","March","April","May","June","July","August","September","October","November","December"],
                monthNamesShort:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
                dayNames:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
                dayNamesShort:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],
                buttonText:{prev:"<div class='fc-text-arrow'>&lsaquo;</div>",
                    next:"<div class='fc-text-arrow'>&rsaquo;</div>",
                    prevYear:"<div class='fc-text-arrow'>&laquo;</div>",
                    nextYear:"<div class='fc-text-arrow'>&raquo;</div>",
                    today:"today",month:"month",week:"week",day:"day"},
                theme:!1,buttonIcons:{prev:"circle-triangle-w",next:"circle-triangle-e"},
                unselectAuto:!0,dropAccept:"*",handleWindowResize:!0},

            Ce={header:{left:"next,prev today",center:"",right:"title"},
                buttonText:{prev:"<div class='fc-text-arrow'>&rsaquo;</div>",
                    next:"<div class='fc-text-arrow'>&lsaquo;</div>",
                    prevYear:"<div class='fc-text-arrow'>&raquo;</div>",
                    nextYear:"<div class='fc-text-arrow'>&laquo;</div>"},
                buttonIcons:{prev:"circle-triangle-e",next:"circle-triangle-w"}},

            xe=t.fullCalendar={version:"1.6.4"},
            ke=xe.views={};
        t.fn.fullCalendar=function(i){

            if("string"==typeof i){

                var n,a=Array.prototype.slice.call(arguments,1);
                return this.each(function(){var s=t.data(this,"fullCalendar");
                    if(s&&t.isFunction(s[i])){var o=s[i].apply(s,a);n===e&&(n=o),
                    "destroy"==i&&t.removeData(this,"fullCalendar")}}),n!==e?n:this
            }
            i=i||{};


            console.log("calendar2 string"+ i.eventSources );
            var o = i.eventSources || [];
            return delete i.eventSources,
            i.events && (o.push(i.events),
                delete i.events),
                i = t.extend(!0, {}, De, i.isRTL || i.isRTL === e && De.isRTL ? Ce : {}, i),
                this.each(function (e, n) {

                        var a = t(n),
                            r = new s(a, i, o);
                        console.log("calendar2 eventSources"+n);

                        a.data("fullCalendar", r),
                            r.render()
                    }
                ),
                this

        },
            xe.sourceNormalizers=[],xe.sourceFetchers=[];
        var Me={dataType:"json",cache:!1},Te=1;xe.addDays=l,
            xe.cloneDate=d,xe.parseDate=m,xe.parseISO8601=v,
            xe.parseTime=_,xe.formatDate=b,xe.formatDates=y;
        var Ie=["sun","mon","tue","wed","thu","fri","sat"],
            Pe=864e5,Se=36e5,Ee=6e4,ze={
                s:function(t){
                    return t.getSeconds()},
                ss:function(t){return O(t.getSeconds())},
                m:function(t){return t.getMinutes()},
                mm:function(t){return O(t.getMinutes())},
                h:function(t){return t.getHours()%12||12},
                hh:function(t){return O(t.getHours()%12||12)},
                H:function(t){return t.getHours()},HH:function(t){return O(t.getHours())},
                d:function(t){return t.getDate()},dd:function(t){return O(t.getDate())},
                ddd:function(t,e){return e.dayNamesShort[t.getDay()]},
                dddd:function(t,e){return e.dayNames[t.getDay()]},
                M:function(t){return t.getMonth()+1},
                MM:function(t){return O(t.getMonth()+1)},
                MMM:function(t,e){return e.monthNamesShort[t.getMonth()]},
                MMMM:function(t,e){

                    //set hidden field with month picked
                    document.getElementById("month_view_date").value = t.getMonth()+1;
                    document.getElementById("year_view_date").value = t.getFullYear();

                    //alert(FullcalendarEngine.app_path()+"?month_view_date="+document.getElementById("month_view_date").value);


                    //choosen_month:function(t){
                    (jQuery).ajax({
                        //data:"month_view_date="+ document.getElementById("month_view_date").value+"&year_view_date="+document.getElementById("year_view_date").value+"&authenticity_token="+FullcalendarEngine.Form.authenticity_token(),
                        dataType:"script",
                        type:"get",
                        //url:"/osms?month_view_date="+document.getElementById("month_view_date").value+"&year_view_date="+document.getElementById("year_view_date").value,
                        url:"/lactics?month_view_date="+document.getElementById("month_view_date").value+"&year_view_date="+document.getElementById("year_view_date").value,
                        error:function(t){
                            //alert(FullcalendarEngine.app_path()+"/osm_sessions?month_view_date="+document.getElementById("month_view_date").value+"&year_view_date="+document.getElementById("year_view_date").value);
                            FullcalendarEngine.Form.render(t)

                        },
                        success:function(){
                            //alert("reloaded");

                            FullcalendarEngine.Form.render(t)
                            //location.reload();

                        },
                        done:function(t){

                            //$('script[src="' + src + '"]').remove();
                            //$('<script>').attr('src', 'full-calendar.js').appendTo('head');
                            //alert("reloaded");
                        }
                    });
                        //choosen_month(t);
                    //alert(document.getElementById("month_view_date").value);
                    //alert(t.getMonth());
                    return e.monthNamesShort[t.getMonth()]
                },
                yy:function(t){return(t.getFullYear()+"").substring(2)},yyyy:function(t){return t.getFullYear()},t:function(t){return t.getHours()<12?"a":"p"},tt:function(t){return t.getHours()<12?"am":"pm"},T:function(t){return t.getHours()<12?"A":"P"},TT:function(t){return t.getHours()<12?"AM":"PM"},u:function(t){return b(t,"yyyy-MM-dd'T'HH:mm:ss'Z'")},S:function(t){var e=t.getDate();return e>10&&20>e?"th":["st","nd","rd"][e%10-1]||"th"},
                w:function(t,e){return e.weekNumberCalculation(t)},
                W:function(t){return w(t)}};xe.dateFormatters=ze,xe.applyAll=$,ke.month=U,ke.basicWeek=K,ke.basicDay=V,i(
            {
                weekMode:"fixed"
            }),
            ke.agendaWeek=G,ke.agendaDay=J,i({allDaySlot:!0,allDayText:"all-day",
            firstHour:6,slotMinutes:30,defaultEventMinutes:120,
            axisFormat:"h(:mm)tt",timeFormat:{agenda:"h:mm{ - h:mm}"},
            dragOpacity:{agenda:.5},minTime:0,maxTime:24,slotEventOverlap:!0})
    }

    (jQuery),function(t){
    function e(e,i,r){
        var l=e.success,
            h=t.extend({},
                e.data||{},{
                    "start-min":s(i,"u"),"start-max":s(r,"u"),singleevents:!0,
                    "max-results":9999
                }),
            c=e.currentTimezone;
        return c&&(h.ctz=c=c.replace(" ","_")),
            t.extend({},e,{url:e.url.replace(/\/basic$/,"/full")+"?alt=json-in-script&callback=?",

                dataType:"jsonp",data:h,startParam:!1,endParam:!1,monthParam:!1,
                success:function(e){
                    var i=[];e.feed.entry&&t.each(e.feed.entry,
                        function(e,s){
                            //console.log("START "+s.gd$when[0].startTime+" END "+s.gd$when[0].endTime);
                            //alert(h);
                            var o,
                                r=s.gd$when[0].startTime,
                                l=n(r,!0),
                                h=n(s.gd$when[0].endTime,!0),
                                u=-1==r.indexOf("T");
                            t.each(s.link,
                                function(t,e){
                                    "text/html"==e.type&&(o=e.href,c&&(o+=(-1==o.indexOf("?")?"?":"&")+"ctz="+c))
                                }),
                            u&&a(h,-1),
                                i.push({
                                    id:s.gCal$uid.value,
                                    title:s.title.$t,
                                    //style_class:s.style_class.$t,
                                    url:o,
                                    start:l,
                                    end:h,
                                    allDay:u,
                                    location:s.gd$where[0].valueString,
                                    description:s.content.$t
                                })
                        });
                    var s=[i].concat(Array.prototype.slice.call(arguments,1)),r=o(l,this,s);
                    return t.isArray(r)?r:i
                }
            })
    }
    var i=t.fullCalendar,
        s=i.formatDate,n=i.parseISO8601,a=i.addDays,o=i.applyAll;
    //i.sourceNormalizers.push(function(t){("gcal"==t.dataType||void 0===t.dataType&&(t.url||"").match(/^(httphttp|https):\/\/www.google.com\/calendar\/feeds\//))&&(t.dataType="gcal",void 0===t.editable&&(t.editable=!1))
    i.sourceNormalizers.push(function(t){("gcal"==t.dataType||void 0===t.dataType&&(t.url||"").match(/^(http|https):\/\/www.google.com\/calendar\/feeds\//))&&(t.dataType="gcal",void 0===t.editable&&(t.editable=!1))
    }),
        i.sourceFetchers.push(function(t,i,s){return"gcal"==t.dataType?e(t,i,s):void 0}),i.gcalFeed=function(e,i){return t.extend({},i,{url:e,dataType:"gcal"
    })
    }
}

(jQuery),
    function(t,e){function i(e,i){var n,a,o,r=e.nodeName.toLowerCase();
        return"area"===r?(n=e.parentNode,
            a=n.name,e.href&&a&&"map"===n.nodeName.toLowerCase()?(o=t("img[usemap=#"+a+"]")[0],
        !!o&&s(o)):!1):(/input|select|textarea|button|object/.test(r)?!e.disabled:"a"===r?e.href||i:i)&&s(e)
    }
        function s(e){
            return t.expr.filters.visible(e)&&!t(e).parents().addBack().filter(function(){return"hidden"===t.css(this,"visibility")}).length}var n=0,a=/^ui-id-\d+$/;t.ui=t.ui||{}
            ,t.extend(t.ui,{version:"1.10.3",keyCode:{BACKSPACE:8,COMMA:188,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,LEFT:37,NUMPAD_ADD:107,NUMPAD_DECIMAL:110,NUMPAD_DIVIDE:111,NUMPAD_ENTER:108,NUMPAD_MULTIPLY:106,NUMPAD_SUBTRACT:109,PAGE_DOWN:34,PAGE_UP:33,PERIOD:190,RIGHT:39,SPACE:32,TAB:9,UP:38
        }
        }),
            t.fn.extend({focus:function(e){return function(i,s){return"number"==typeof i?this.each(function(){var e=this;setTimeout(function(){t(e).focus(),s&&s.call(e)},i)}):e.apply(this,arguments)}}(t.fn.focus),scrollParent:function(){var e;return e=t.ui.ie&&/(static|relative)/.test(this.css("position"))||/absolute/.test(this.css("position"))?this.parents().filter(function(){return/(relative|absolute|fixed)/.test(t.css(this,"position"))&&/(auto|scroll)/.test(t.css(this,"overflow")+t.css(this,"overflow-y")+t.css(this,"overflow-x"))}).eq(0):this.parents().filter(function(){return/(auto|scroll)/.test(t.css(this,"overflow")+t.css(this,"overflow-y")+t.css(this,"overflow-x"))}).eq(0),/fixed/.test(this.css("position"))||!e.length?t(document):e
            },
                zIndex:function(i){if(i!==e)return this.css("zIndex",i);if(this.length)for(var s,n,a=t(this[0]);a.length&&a[0]!==document;){if(s=a.css("position"),("absolute"===s||"relative"===s||"fixed"===s)&&(n=parseInt(a.css("zIndex"),10),!isNaN(n)&&0!==n))return n;a=a.parent()}return 0},uniqueId:function(){return this.each(function(){this.id||(this.id="ui-id-"+ ++n)})},removeUniqueId:function(){return this.each(function(){a.test(this.id)&&t(this).removeAttr("id")})}}),t.extend(t.expr[":"],{data:t.expr.createPseudo?t.expr.createPseudo(function(e){return function(i){return!!t.data(i,e)}}):function(e,i,s){return!!t.data(e,s[3])},focusable:function(e){return i(e,!isNaN(t.attr(e,"tabindex")))},tabbable:function(e){var s=t.attr(e,"tabindex"),
            n=isNaN(s);return(n||s>=0)&&i(e,!n)}}),t("<a>").outerWidth(1).jquery||t.each(["Width","Height"],
            function(i,s){
                function n(e,i,s,n){
                    return t.each(a,function(){i-=parseFloat(t.css(e,"padding"+this))||0,s&&(i-=parseFloat(t.css(e,"border"+this+"Width"))||0),n&&(i-=parseFloat(t.css(e,"margin"+this))||0)}),i
                }
                var a="Width"===s?["Left","Right"]:["Top","Bottom"],o=s.toLowerCase(),
                    r={innerWidth:t.fn.innerWidth,innerHeight:t.fn.innerHeight,outerWidth:t.fn.outerWidth,outerHeight:t.fn.outerHeight};
                t.fn["inner"+s]=function(i){return i===e?r["inner"+s].call(this):this.each(function(){t(this).css(o,n(this,i)+"px")})},t.fn["outer"+s]=function(e,i){return"number"!=typeof e?r["outer"+s].call(this,e):this.each(function(){t(this).css(o,n(this,e,!0,i)+"px")})}}),t.fn.addBack||(t.fn.addBack=function(t){return this.add(null==t?this.prevObject:this.prevObject.filter(t))}),t("<a>").data("a-b","a").removeData("a-b").data("a-b")&&(t.fn.removeData=function(e){return function(i){return arguments.length?e.call(this,t.camelCase(i)):e.call(this)}}(t.fn.removeData)),t.ui.ie=!!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase()),
            t.support.selectstart="onselectstart"in document.createElement("div"),
            t.fn.extend({disableSelection:function(){return this.bind((t.support.selectstart?"selectstart":"mousedown")+".ui-disableSelection",
                function(t){t.preventDefault()})},
                enableSelection:function(){return this.unbind(".ui-disableSelection")}}),t.extend(t.ui,{plugin:{add:function(e,i,s){var n,a=t.ui[e].prototype;for(n in s)a.plugins[n]=a.plugins[n]||[],a.plugins[n].push([i,s[n]])},call:function(t,e,i){var s,n=t.plugins[e];if(n&&t.element[0].parentNode&&11!==t.element[0].parentNode.nodeType)for(s=0;n.length>s;s++)t.options[n[s][0]]&&n[s][1].apply(t.element,i)}},hasScroll:function(e,i){if("hidden"===t(e).css("overflow"))return!1;var s=i&&"left"===i?"scrollLeft":"scrollTop",n=!1;return e[s]>0?!0:(e[s]=1,n=e[s]>0,e[s]=0,n)}})}


    (jQuery),function(t,e){var i=0,s=Array.prototype.slice,n=t.cleanData;t.cleanData=function(e){for(var i,s=0;null!=(i=e[s]);s++)try{t(i).triggerHandler("remove")}catch(a){}n(e)},t.widget=function(i,s,n){var a,o,r,l,h={},c=i.split(".")[0];i=i.split(".")[1],a=c+"-"+i,n||(n=s,s=t.Widget),t.expr[":"][a.toLowerCase()]=function(e){return!!t.data(e,a)},t[c]=t[c]||{},o=t[c][i],r=t[c][i]=function(t,i){return this._createWidget?(arguments.length&&this._createWidget(t,i),e):new r(t,i)},t.extend(r,o,{version:n.version,_proto:t.extend({},n),_childConstructors:[]}),l=new s,l.options=t.widget.extend({},l.options),t.each(n,function(i,n){return t.isFunction(n)?(h[i]=function(){var t=function(){return s.prototype[i].apply(this,arguments)},e=function(t){return s.prototype[i].apply(this,t)};return function(){var i,s=this._super,a=this._superApply;return this._super=t,this._superApply=e,i=n.apply(this,arguments),this._super=s,this._superApply=a,i}}(),e):(h[i]=n,e)}),r.prototype=t.widget.extend(l,{widgetEventPrefix:o?l.widgetEventPrefix:i},h,{constructor:r,namespace:c,widgetName:i,widgetFullName:a}),o?(t.each(o._childConstructors,function(e,i){var s=i.prototype;t.widget(s.namespace+"."+s.widgetName,r,i._proto)}),delete o._childConstructors):s._childConstructors.push(r),t.widget.bridge(i,r)},t.widget.extend=function(i){for(var n,a,o=s.call(arguments,1),r=0,l=o.length;l>r;r++)for(n in o[r])a=o[r][n],o[r].hasOwnProperty(n)&&a!==e&&(i[n]=t.isPlainObject(a)?t.isPlainObject(i[n])?t.widget.extend({},i[n],a):t.widget.extend({},a):a);return i},t.widget.bridge=function(i,n){var a=n.prototype.widgetFullName||i;t.fn[i]=function(o){var r="string"==typeof o,l=s.call(arguments,1),h=this;return o=!r&&l.length?t.widget.extend.apply(null,[o].concat(l)):o,r?this.each(function(){var s,n=t.data(this,a);return n?t.isFunction(n[o])&&"_"!==o.charAt(0)?(s=n[o].apply(n,l),s!==n&&s!==e?(h=s&&s.jquery?h.pushStack(s.get()):s,!1):e):t.error("no such method '"+o+"' for "+i+" widget instance"):t.error("cannot call methods on "+i+" prior to initialization; attempted to call method '"+o+"'")}):this.each(function(){var e=t.data(this,a);e?e.option(o||{})._init():t.data(this,a,new n(o,this))}),h}},t.Widget=function(){},t.Widget._childConstructors=[],t.Widget.prototype={widgetName:"widget",widgetEventPrefix:"",defaultElement:"<div>",options:{disabled:!1,create:null},_createWidget:function(e,s){s=t(s||this.defaultElement||this)[0],this.element=t(s),this.uuid=i++,this.eventNamespace="."+this.widgetName+this.uuid,this.options=t.widget.extend({},this.options,this._getCreateOptions(),e),this.bindings=t(),this.hoverable=t(),this.focusable=t(),s!==this&&(t.data(s,this.widgetFullName,this),this._on(!0,this.element,{remove:function(t){t.target===s&&this.destroy()}}),this.document=t(s.style?s.ownerDocument:s.document||s),this.window=t(this.document[0].defaultView||this.document[0].parentWindow)),this._create(),this._trigger("create",null,this._getCreateEventData()),this._init()},_getCreateOptions:t.noop,_getCreateEventData:t.noop,_create:t.noop,_init:t.noop,destroy:function(){this._destroy(),this.element.unbind(this.eventNamespace).removeData(this.widgetName).removeData(this.widgetFullName).removeData(t.camelCase(this.widgetFullName)),this.widget().unbind(this.eventNamespace).removeAttr("aria-disabled").removeClass(this.widgetFullName+"-disabled ui-state-disabled"),this.bindings.unbind(this.eventNamespace),this.hoverable.removeClass("ui-state-hover"),this.focusable.removeClass("ui-state-focus")},_destroy:t.noop,widget:function(){return this.element},option:function(i,s){var n,a,o,r=i;if(0===arguments.length)return t.widget.extend({},this.options);if("string"==typeof i)if(r={},n=i.split("."),i=n.shift(),n.length){for(a=r[i]=t.widget.extend({},this.options[i]),o=0;n.length-1>o;o++)a[n[o]]=a[n[o]]||{},a=a[n[o]];
    if(i=n.pop(),s===e)return a[i]===e?null:a[i];a[i]=s}else{if(s===e)return this.options[i]===e?null:this.options[i];r[i]=s}return this._setOptions(r),this},
    _setOptions:function(t){var e;for(e in t)this._setOption(e,t[e]);return this},
    _setOption:function(t,e){return this.options[t]=e,"disabled"===t&&(this.widget().toggleClass(this.widgetFullName+"-disabled ui-state-disabled",!!e).attr("aria-disabled",e),
        this.hoverable.removeClass("ui-state-hover"),
        this.focusable.removeClass("ui-state-focus")),this},
    enable:function(){return this._setOption("disabled",!1)},
    disable:function(){return this._setOption("disabled",!0)},
    _on:function(i,s,n){var a,o=this;"boolean"!=typeof i&&(n=s,s=i,i=!1),n?(s=a=t(s),this.bindings=this.bindings.add(s)):(n=s,s=this.element,a=this.widget()),t.each(n,
        function(n,r){function l(){return i||o.options.disabled!==!0&&!t(this).hasClass("ui-state-disabled")?("string"==typeof r?o[r]:r).apply(o,arguments):e}"string"!=typeof r&&(l.guid=r.guid=r.guid||l.guid||t.guid++);
            var h=n.match(/^(\w+)\s*(.*)$/),c=h[1]+o.eventNamespace,u=h[2];
            u?a.delegate(u,c,l):s.bind(c,l)})},
    _off:function(t,e){e=(e||"").split(" ").join(this.eventNamespace+" ")+this.eventNamespace,t.unbind(e).undelegate(e)
    },
    _delay:function(t,e){function i(){return("string"==typeof t?s[t]:t).apply(s,arguments)}var s=this;return setTimeout(i,e||0)},
    _hoverable:function(e){this.hoverable=this.hoverable.add(e),this._on(e,{mouseenter:function(e){t(e.currentTarget).addClass("ui-state-hover")},mouseleave:function(e){t(e.currentTarget).removeClass("ui-state-hover")}})},
    _focusable:function(e){this.focusable=this.focusable.add(e),this._on(e,{focusin:function(e){t(e.currentTarget).addClass("ui-state-focus")},focusout:function(e){t(e.currentTarget).removeClass("ui-state-focus")}})},
    _trigger:function(e,i,s){var n,a,o=this.options[e];if(s=s||{},i=t.Event(i),i.type=(e===this.widgetEventPrefix?e:this.widgetEventPrefix+e).toLowerCase(),i.target=this.element[0],a=i.originalEvent)for(n in a)n in i||(i[n]=a[n]);return this.element.trigger(i,s),!(t.isFunction(o)&&o.apply(this.element[0],[i].concat(s))===!1||i.isDefaultPrevented())}},
    t.each({show:"fadeIn",hide:"fadeOut"},
        function(e,i){t.Widget.prototype["_"+e]=function(s,n,a){"string"==typeof n&&(n={effect:n});var o,r=n?n===!0||"number"==typeof n?i:n.effect||i:e;n=n||{},"number"==typeof n&&(n={duration:n}),o=!t.isEmptyObject(n),n.complete=a,n.delay&&s.delay(n.delay),o&&t.effects&&t.effects.effect[r]?s[e](n):r!==e&&s[r]?s[r](n.duration,n.easing,a):s.queue(function(i){t(this)[e](),a&&a.call(s[0]),i()
    }
)}
})
}

(jQuery),function(t){var e=!1;
    t(document).mouseup(
        function(){e=!1}),t.widget("ui.mouse",{
        version:"1.10.3",
        options:{
            cancel:"input,textarea,button,select,option",
            distance:1,delay:0
        }
        ,_mouseInit:function(){
            var e=this;this.element.bind("mousedown."+this.widgetName,function(t){
                    return e._mouseDown(t)
                }
            ).bind("click."+this.widgetName,function(i){return!0===t.data(i.target,e.widgetName+".preventClickEvent")?(t.removeData(i.target,e.widgetName+".preventClickEvent"),i.stopImmediatePropagation(),!1):void 0
                }
            ),
                this.started=!1},
        _mouseDestroy:function(){this.element.unbind("."+this.widgetName),
        this._mouseMoveDelegate&&t(document).unbind("mousemove."+this.widgetName,this._mouseMoveDelegate).unbind("mouseup."+this.widgetName,this._mouseUpDelegate)
        }
        ,_mouseDown:function(i){if(!e){this._mouseStarted&&this._mouseUp(i),this._mouseDownEvent=i;var s=this,n=1===i.which,a="string"==typeof this.options.cancel&&i.target.nodeName?t(i.target).closest(this.options.cancel).length:!1;return n&&!a&&this._mouseCapture(i)?(this.mouseDelayMet=!this.options.delay,this.mouseDelayMet||(this._mouseDelayTimer=setTimeout(function(){s.mouseDelayMet=!0},this.options.delay)),this._mouseDistanceMet(i)&&this._mouseDelayMet(i)&&(this._mouseStarted=this._mouseStart(i)!==!1,
            !this._mouseStarted)?(i.preventDefault(),!0):(!0===t.data(i.target,this.widgetName+".preventClickEvent")&&t.removeData(i.target,this.widgetName+".preventClickEvent"),this._mouseMoveDelegate=function(t){return s._mouseMove(t)},this._mouseUpDelegate=function(t){return s._mouseUp(t)},t(document).bind("mousemove."+this.widgetName,this._mouseMoveDelegate).bind("mouseup."+this.widgetName,this._mouseUpDelegate),i.preventDefault(),e=!0,!0)):!0
        }
        }
        ,_mouseMove:function(e){return t.ui.ie&&(!document.documentMode||9>document.documentMode)&&!e.button?this._mouseUp(e):this._mouseStarted?(this._mouseDrag(e),e.preventDefault()):(this._mouseDistanceMet(e)&&this._mouseDelayMet(e)&&(this._mouseStarted=this._mouseStart(this._mouseDownEvent,e)!==!1,this._mouseStarted?this._mouseDrag(e):this._mouseUp(e)),!this._mouseStarted)},_mouseUp:function(e){return t(document).unbind("mousemove."+this.widgetName,this._mouseMoveDelegate).unbind("mouseup."+this.widgetName,this._mouseUpDelegate),this._mouseStarted&&(this._mouseStarted=!1,e.target===this._mouseDownEvent.target&&t.data(e.target,this.widgetName+".preventClickEvent",!0),this._mouseStop(e)),!1},_mouseDistanceMet:function(t){return Math.max(Math.abs(this._mouseDownEvent.pageX-t.pageX),Math.abs(this._mouseDownEvent.pageY-t.pageY))>=this.options.distance},
        _mouseDelayMet:function(){return this.mouseDelayMet},_mouseStart:function(){},_mouseDrag:function(){},_mouseStop:function(){},_mouseCapture:function(){return!0}})}
(jQuery),function(t,e){function i(t,e,i){return[parseFloat(t[0])*(p.test(t[0])?e/100:1),parseFloat(t[1])*(p.test(t[1])?i/100:1)]}function s(e,i){return parseInt(t.css(e,i),10)||0}function n(e){var i=e[0];return 9===i.nodeType?{width:e.width(),height:e.height(),offset:{top:0,left:0}}:t.isWindow(i)?{width:e.width(),height:e.height(),offset:{top:e.scrollTop(),left:e.scrollLeft()}}:i.preventDefault?{width:0,height:0,offset:{top:i.pageY,left:i.pageX}}:{width:e.outerWidth(),height:e.outerHeight(),offset:e.offset()}}t.ui=t.ui||{};var a,o=Math.max,r=Math.abs,l=Math.round,h=/left|center|right/,c=/top|center|bottom/,u=/[\+\-]\d+(\.[\d]+)?%?/,d=/^\w+/,p=/%$/,f=t.fn.position;t.position={scrollbarWidth:function(){if(a!==e)return a;var i,s,n=t("<div style='display:block;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>"),o=n.children()[0];return t("body").append(n),i=o.offsetWidth,n.css("overflow","scroll"),s=o.offsetWidth,i===s&&(s=n[0].clientWidth),n.remove(),a=i-s},getScrollInfo:function(e){var i=e.isWindow?"":e.element.css("overflow-x"),s=e.isWindow?"":e.element.css("overflow-y"),n="scroll"===i||"auto"===i&&e.width<e.element[0].scrollWidth,a="scroll"===s||"auto"===s&&e.height<e.element[0].scrollHeight;return{width:a?t.position.scrollbarWidth():0,height:n?t.position.scrollbarWidth():0}},getWithinInfo:function(e){var i=t(e||window),s=t.isWindow(i[0]);
    return{
        element:i,isWindow:s,offset:i.offset()||{left:0,top:0},scrollLeft:i.scrollLeft(),scrollTop:i.scrollTop(),width:s?i.width():i.outerWidth(),height:s?i.height():i.outerHeight()
    }
}
},
    t.fn.position=function(e){
        if(!e||!e.of)
            return f.apply(this,arguments);
        e=t.extend({},e);
        var a,p,g,m,v,_,b=t(e.of),y=t.position.getWithinInfo(e.within),w=t.position.getScrollInfo(y),D=(e.collision||"flip").split(" "),C={};
        return _=n(b),b[0].preventDefault&&(e.at="left top"),
            p=_.width,g=_.height,m=_.offset,v=t.extend({},m),t.each(["my","at"],
            function(){var t,i,s=(e[this]||"").split(" ");
                1===s.length&&(s=h.test(s[0])?s.concat(["center"]):c.test(s[0])?["center"].concat(s):["center","center"]),s[0]=h.test(s[0])?s[0]:"center",s[1]=c.test(s[1])?s[1]:"center",t=u.exec(s[0]),i=u.exec(s[1]),C[this]=[t?t[0]:0,i?i[0]:0],e[this]=[d.exec(s[0])[0],d.exec(s[1])[0]]}),1===D.length&&(D[1]=D[0]),"right"===e.at[0]?v.left+=p:"center"===e.at[0]&&(v.left+=p/2),"bottom"===e.at[1]?v.top+=g:"center"===e.at[1]&&(v.top+=g/2),a=i(C.at,p,g),v.left+=a[0],v.top+=a[1],this.each(function(){var n,h,c=t(this),u=c.outerWidth(),d=c.outerHeight(),f=s(this,"marginLeft"),_=s(this,"marginTop"),x=u+f+s(this,"marginRight")+w.width,k=d+_+s(this,"marginBottom")+w.height,M=t.extend({},v),T=i(C.my,c.outerWidth(),c.outerHeight());
            "right"===e.my[0]?M.left-=u:"center"===e.my[0]&&(M.left-=u/2),"bottom"===e.my[1]?M.top-=d:"center"===e.my[1]&&(M.top-=d/2),M.left+=T[0],M.top+=T[1],t.support.offsetFractions||(M.left=l(M.left),M.top=l(M.top)),n={marginLeft:f,marginTop:_},t.each(["left","top"],
                function(i,s){t.ui.position[D[i]]&&t.ui.position[D[i]][s](M,{targetWidth:p,targetHeight:g,elemWidth:u,elemHeight:d,collisionPosition:n,collisionWidth:x,collisionHeight:k,offset:[a[0]+T[0],a[1]+T[1]],my:e.my,at:e.at,within:y,elem:c})}),e.using&&(h=function(t){var i=m.left-M.left,s=i+p-u,n=m.top-M.top,a=n+g-d,l={target:{element:b,left:m.left,top:m.top,width:p,height:g},element:{element:c,left:M.left,top:M.top,width:u,height:d},horizontal:0>s?"left":i>0?"right":"center",vertical:0>a?"top":n>0?"bottom":"middle"};u>p&&p>r(i+s)&&(l.horizontal="center"),d>g&&g>r(n+a)&&(l.vertical="middle"),l.important=o(r(i),r(s))>o(r(n),r(a))?"horizontal":"vertical",e.using.call(this,t,l)}),c.offset(t.extend(M,{using:h}))})
    },
    t.ui.position={fit:{left:function(t,e){var i,s=e.within,n=s.isWindow?s.scrollLeft:s.offset.left,a=s.width,r=t.left-e.collisionPosition.marginLeft,l=n-r,h=r+e.collisionWidth-a-n;e.collisionWidth>a?l>0&&0>=h?(i=t.left+l+e.collisionWidth-a-n,t.left+=l-i):t.left=h>0&&0>=l?n:l>h?n+a-e.collisionWidth:n:l>0?t.left+=l:h>0?t.left-=h:t.left=o(t.left-r,t.left)},top:function(t,e){var i,s=e.within,n=s.isWindow?s.scrollTop:s.offset.top,a=e.within.height,r=t.top-e.collisionPosition.marginTop,l=n-r,h=r+e.collisionHeight-a-n;e.collisionHeight>a?l>0&&0>=h?(i=t.top+l+e.collisionHeight-a-n,t.top+=l-i):t.top=h>0&&0>=l?n:l>h?n+a-e.collisionHeight:n:l>0?t.top+=l:h>0?t.top-=h:t.top=o(t.top-r,t.top)}},flip:{left:function(t,e){var i,s,n=e.within,a=n.offset.left+n.scrollLeft,o=n.width,l=n.isWindow?n.scrollLeft:n.offset.left,h=t.left-e.collisionPosition.marginLeft,c=h-l,u=h+e.collisionWidth-o-l,d="left"===e.my[0]?-e.elemWidth:"right"===e.my[0]?e.elemWidth:0,p="left"===e.at[0]?e.targetWidth:"right"===e.at[0]?-e.targetWidth:0,f=-2*e.offset[0];0>c?(i=t.left+d+p+f+e.collisionWidth-o-a,(0>i||r(c)>i)&&(t.left+=d+p+f)):u>0&&(s=t.left-e.collisionPosition.marginLeft+d+p+f-l,(s>0||u>r(s))&&(t.left+=d+p+f))},top:function(t,e){var i,s,n=e.within,a=n.offset.top+n.scrollTop,o=n.height,l=n.isWindow?n.scrollTop:n.offset.top,h=t.top-e.collisionPosition.marginTop,c=h-l,u=h+e.collisionHeight-o-l,d="top"===e.my[1],p=d?-e.elemHeight:"bottom"===e.my[1]?e.elemHeight:0,f="top"===e.at[1]?e.targetHeight:"bottom"===e.at[1]?-e.targetHeight:0,g=-2*e.offset[1];0>c?(s=t.top+p+f+g+e.collisionHeight-o-a,t.top+p+f+g>c&&(0>s||r(c)>s)&&(t.top+=p+f+g)):u>0&&(i=t.top-e.collisionPosition.marginTop+p+f+g-l,t.top+p+f+g>u&&(i>0||u>r(i))&&(t.top+=p+f+g))}},flipfit:{left:function(){t.ui.position.flip.left.apply(this,arguments),t.ui.position.fit.left.apply(this,arguments)},top:function(){t.ui.position.flip.top.apply(this,arguments),t.ui.position.fit.top.apply(this,arguments)}}},function(){var e,i,s,n,a,o=document.getElementsByTagName("body")[0],r=document.createElement("div");e=document.createElement(o?"div":"body"),s={visibility:"hidden",width:0,height:0,border:0,margin:0,background:"none"},o&&t.extend(s,{position:"absolute",left:"-1000px",top:"-1000px"});for(a in s)e.style[a]=s[a];e.appendChild(r),i=o||document.documentElement,i.insertBefore(e,i.firstChild),r.style.cssText="position: absolute; left: 10.7432222px;",n=t(r).offset().left,t.support.offsetFractions=n>10&&11>n,e.innerHTML="",i.removeChild(e)}()}
(jQuery),function(t){t.widget("ui.draggable",t.ui.mouse,{version:"1.10.3",widgetEventPrefix:"drag",options:{addClasses:!0,appendTo:"parent",axis:!1,connectToSortable:!1,containment:!1,cursor:"auto",cursorAt:!1,grid:!1,handle:!1,helper:"original",iframeFix:!1,opacity:!1,refreshPositions:!1,revert:!1,revertDuration:500,scope:"default",scroll:!0,scrollSensitivity:20,scrollSpeed:20,snap:!1,snapMode:"both",snapTolerance:20,stack:!1,zIndex:!1,drag:null,start:null,stop:null},_create:function(){"original"!==this.options.helper||/^(?:r|a|f)/.test(this.element.css("position"))||(this.element[0].style.position="relative"),this.options.addClasses&&this.element.addClass("ui-draggable"),this.options.disabled&&this.element.addClass("ui-draggable-disabled"),this._mouseInit()},_destroy:function(){this.element.removeClass("ui-draggable ui-draggable-dragging ui-draggable-disabled"),this._mouseDestroy()},_mouseCapture:function(e){var i=this.options;return this.helper||i.disabled||t(e.target).closest(".ui-resizable-handle").length>0?!1:(this.handle=this._getHandle(e),this.handle?(t(i.iframeFix===!0?"iframe":i.iframeFix).each(function(){t("<div class='ui-draggable-iframeFix' style='background: #fff;'></div>").css({width:this.offsetWidth+"px",height:this.offsetHeight+"px",position:"absolute",opacity:"0.001",zIndex:1e3}).css(t(this).offset()).appendTo("body")}),!0):!1)},_mouseStart:function(e){var i=this.options;return this.helper=this._createHelper(e),this.helper.addClass("ui-draggable-dragging"),this._cacheHelperProportions(),t.ui.ddmanager&&(t.ui.ddmanager.current=this),this._cacheMargins(),this.cssPosition=this.helper.css("position"),this.scrollParent=this.helper.scrollParent(),this.offsetParent=this.helper.offsetParent(),this.offsetParentCssPosition=this.offsetParent.css("position"),this.offset=this.positionAbs=this.element.offset(),this.offset={top:this.offset.top-this.margins.top,left:this.offset.left-this.margins.left},this.offset.scroll=!1,t.extend(this.offset,{click:{left:e.pageX-this.offset.left,top:e.pageY-this.offset.top},parent:this._getParentOffset(),relative:this._getRelativeOffset()}),this.originalPosition=this.position=this._generatePosition(e),this.originalPageX=e.pageX,this.originalPageY=e.pageY,i.cursorAt&&this._adjustOffsetFromHelper(i.cursorAt),this._setContainment(),this._trigger("start",e)===!1?(this._clear(),!1):(this._cacheHelperProportions(),t.ui.ddmanager&&!i.dropBehaviour&&t.ui.ddmanager.prepareOffsets(this,e),this._mouseDrag(e,!0),t.ui.ddmanager&&t.ui.ddmanager.dragStart(this,e),!0)},_mouseDrag:function(e,i){if("fixed"===this.offsetParentCssPosition&&(this.offset.parent=this._getParentOffset()),this.position=this._generatePosition(e),this.positionAbs=this._convertPositionTo("absolute"),!i){var s=this._uiHash();if(this._trigger("drag",e,s)===!1)return this._mouseUp({}),!1;this.position=s.position}return this.options.axis&&"y"===this.options.axis||(this.helper[0].style.left=this.position.left+"px"),this.options.axis&&"x"===this.options.axis||(this.helper[0].style.top=this.position.top+"px"),t.ui.ddmanager&&t.ui.ddmanager.drag(this,e),!1},_mouseStop:function(e){var i=this,s=!1;return t.ui.ddmanager&&!this.options.dropBehaviour&&(s=t.ui.ddmanager.drop(this,e)),this.dropped&&(s=this.dropped,this.dropped=!1),"original"!==this.options.helper||t.contains(this.element[0].ownerDocument,this.element[0])?("invalid"===this.options.revert&&!s||"valid"===this.options.revert&&s||this.options.revert===!0||t.isFunction(this.options.revert)&&this.options.revert.call(this.element,s)?t(this.helper).animate(this.originalPosition,parseInt(this.options.revertDuration,10),function(){i._trigger("stop",e)!==!1&&i._clear()}):this._trigger("stop",e)!==!1&&this._clear(),!1):!1},_mouseUp:function(e){return t("div.ui-draggable-iframeFix").each(function(){this.parentNode.removeChild(this)}),t.ui.ddmanager&&t.ui.ddmanager.dragStop(this,e),t.ui.mouse.prototype._mouseUp.call(this,e)},cancel:function(){return this.helper.is(".ui-draggable-dragging")?this._mouseUp({}):this._clear(),this},_getHandle:function(e){return this.options.handle?!!t(e.target).closest(this.element.find(this.options.handle)).length:!0},_createHelper:function(e){var i=this.options,s=t.isFunction(i.helper)?t(i.helper.apply(this.element[0],[e])):"clone"===i.helper?this.element.clone().removeAttr("id"):this.element;return s.parents("body").length||s.appendTo("parent"===i.appendTo?this.element[0].parentNode:i.appendTo),s[0]===this.element[0]||/(fixed|absolute)/.test(s.css("position"))||s.css("position","absolute"),s},_adjustOffsetFromHelper:function(e){"string"==typeof e&&(e=e.split(" ")),t.isArray(e)&&(e={left:+e[0],top:+e[1]||0}),"left"in e&&(this.offset.click.left=e.left+this.margins.left),"right"in e&&(this.offset.click.left=this.helperProportions.width-e.right+this.margins.left),"top"in e&&(this.offset.click.top=e.top+this.margins.top),"bottom"in e&&(this.offset.click.top=this.helperProportions.height-e.bottom+this.margins.top)},_getParentOffset:function(){var e=this.offsetParent.offset();return"absolute"===this.cssPosition&&this.scrollParent[0]!==document&&t.contains(this.scrollParent[0],this.offsetParent[0])&&(e.left+=this.scrollParent.scrollLeft(),e.top+=this.scrollParent.scrollTop()),(this.offsetParent[0]===document.body||this.offsetParent[0].tagName&&"html"===this.offsetParent[0].tagName.toLowerCase()&&t.ui.ie)&&(e={top:0,left:0}),{top:e.top+(parseInt(this.offsetParent.css("borderTopWidth"),10)||0),left:e.left+(parseInt(this.offsetParent.css("borderLeftWidth"),10)||0)}},_getRelativeOffset:function(){if("relative"===this.cssPosition){var t=this.element.position();return{top:t.top-(parseInt(this.helper.css("top"),10)||0)+this.scrollParent.scrollTop(),left:t.left-(parseInt(this.helper.css("left"),10)||0)+this.scrollParent.scrollLeft()}}return{top:0,left:0}},_cacheMargins:function(){this.margins={left:parseInt(this.element.css("marginLeft"),10)||0,top:parseInt(this.element.css("marginTop"),10)||0,right:parseInt(this.element.css("marginRight"),10)||0,bottom:parseInt(this.element.css("marginBottom"),10)||0}},_cacheHelperProportions:function(){this.helperProportions={width:this.helper.outerWidth(),height:this.helper.outerHeight()}},_setContainment:function(){var e,i,s,n=this.options;return n.containment?"window"===n.containment?(this.containment=[t(window).scrollLeft()-this.offset.relative.left-this.offset.parent.left,t(window).scrollTop()-this.offset.relative.top-this.offset.parent.top,t(window).scrollLeft()+t(window).width()-this.helperProportions.width-this.margins.left,t(window).scrollTop()+(t(window).height()||document.body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top],void 0):"document"===n.containment?(this.containment=[0,0,t(document).width()-this.helperProportions.width-this.margins.left,(t(document).height()||document.body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top],void 0):n.containment.constructor===Array?(this.containment=n.containment,void 0):("parent"===n.containment&&(n.containment=this.helper[0].parentNode),i=t(n.containment),s=i[0],s&&(e="hidden"!==i.css("overflow"),this.containment=[(parseInt(i.css("borderLeftWidth"),10)||0)+(parseInt(i.css("paddingLeft"),10)||0),(parseInt(i.css("borderTopWidth"),10)||0)+(parseInt(i.css("paddingTop"),10)||0),(e?Math.max(s.scrollWidth,s.offsetWidth):s.offsetWidth)-(parseInt(i.css("borderRightWidth"),10)||0)-(parseInt(i.css("paddingRight"),10)||0)-this.helperProportions.width-this.margins.left-this.margins.right,(e?Math.max(s.scrollHeight,s.offsetHeight):s.offsetHeight)-(parseInt(i.css("borderBottomWidth"),10)||0)-(parseInt(i.css("paddingBottom"),10)||0)-this.helperProportions.height-this.margins.top-this.margins.bottom],this.relative_container=i),void 0):(this.containment=null,void 0)},_convertPositionTo:function(e,i){i||(i=this.position);var s="absolute"===e?1:-1,n="absolute"!==this.cssPosition||this.scrollParent[0]!==document&&t.contains(this.scrollParent[0],this.offsetParent[0])?this.scrollParent:this.offsetParent;return this.offset.scroll||(this.offset.scroll={top:n.scrollTop(),left:n.scrollLeft()}),{top:i.top+this.offset.relative.top*s+this.offset.parent.top*s-("fixed"===this.cssPosition?-this.scrollParent.scrollTop():this.offset.scroll.top)*s,left:i.left+this.offset.relative.left*s+this.offset.parent.left*s-("fixed"===this.cssPosition?-this.scrollParent.scrollLeft():this.offset.scroll.left)*s}},_generatePosition:function(e){var i,s,n,a,o=this.options,r="absolute"!==this.cssPosition||this.scrollParent[0]!==document&&t.contains(this.scrollParent[0],this.offsetParent[0])?this.scrollParent:this.offsetParent,l=e.pageX,h=e.pageY;return this.offset.scroll||(this.offset.scroll={top:r.scrollTop(),left:r.scrollLeft()}),this.originalPosition&&(this.containment&&(this.relative_container?(s=this.relative_container.offset(),i=[this.containment[0]+s.left,this.containment[1]+s.top,this.containment[2]+s.left,this.containment[3]+s.top]):i=this.containment,e.pageX-this.offset.click.left<i[0]&&(l=i[0]+this.offset.click.left),e.pageY-this.offset.click.top<i[1]&&(h=i[1]+this.offset.click.top),e.pageX-this.offset.click.left>i[2]&&(l=i[2]+this.offset.click.left),e.pageY-this.offset.click.top>i[3]&&(h=i[3]+this.offset.click.top)),o.grid&&(n=o.grid[1]?this.originalPageY+Math.round((h-this.originalPageY)/o.grid[1])*o.grid[1]:this.originalPageY,h=i?n-this.offset.click.top>=i[1]||n-this.offset.click.top>i[3]?n:n-this.offset.click.top>=i[1]?n-o.grid[1]:n+o.grid[1]:n,a=o.grid[0]?this.originalPageX+Math.round((l-this.originalPageX)/o.grid[0])*o.grid[0]:this.originalPageX,l=i?a-this.offset.click.left>=i[0]||a-this.offset.click.left>i[2]?a:a-this.offset.click.left>=i[0]?a-o.grid[0]:a+o.grid[0]:a)),{top:h-this.offset.click.top-this.offset.relative.top-this.offset.parent.top+("fixed"===this.cssPosition?-this.scrollParent.scrollTop():this.offset.scroll.top),left:l-this.offset.click.left-this.offset.relative.left-this.offset.parent.left+("fixed"===this.cssPosition?-this.scrollParent.scrollLeft():this.offset.scroll.left)}},_clear:function(){this.helper.removeClass("ui-draggable-dragging"),this.helper[0]===this.element[0]||this.cancelHelperRemoval||this.helper.remove(),this.helper=null,this.cancelHelperRemoval=!1},_trigger:function(e,i,s){return s=s||this._uiHash(),t.ui.plugin.call(this,e,[i,s]),"drag"===e&&(this.positionAbs=this._convertPositionTo("absolute")),t.Widget.prototype._trigger.call(this,e,i,s)},plugins:{},_uiHash:function(){return{helper:this.helper,position:this.position,originalPosition:this.originalPosition,offset:this.positionAbs}}}),t.ui.plugin.add("draggable","connectToSortable",{start:function(e,i){var s=t(this).data("ui-draggable"),n=s.options,a=t.extend({},i,{item:s.element});s.sortables=[],t(n.connectToSortable).each(function(){var i=t.data(this,"ui-sortable");i&&!i.options.disabled&&(s.sortables.push({instance:i,shouldRevert:i.options.revert}),i.refreshPositions(),i._trigger("activate",e,a))})},stop:function(e,i){var s=t(this).data("ui-draggable"),n=t.extend({},i,{item:s.element});t.each(s.sortables,function(){this.instance.isOver?(this.instance.isOver=0,s.cancelHelperRemoval=!0,this.instance.cancelHelperRemoval=!1,this.shouldRevert&&(this.instance.options.revert=this.shouldRevert),this.instance._mouseStop(e),this.instance.options.helper=this.instance.options._helper,"original"===s.options.helper&&this.instance.currentItem.css({top:"auto",left:"auto"})):(this.instance.cancelHelperRemoval=!1,this.instance._trigger("deactivate",e,n))})},drag:function(e,i){var s=t(this).data("ui-draggable"),n=this;t.each(s.sortables,function(){var a=!1,o=this;this.instance.positionAbs=s.positionAbs,this.instance.helperProportions=s.helperProportions,this.instance.offset.click=s.offset.click,this.instance._intersectsWith(this.instance.containerCache)&&(a=!0,t.each(s.sortables,function(){return this.instance.positionAbs=s.positionAbs,this.instance.helperProportions=s.helperProportions,this.instance.offset.click=s.offset.click,this!==o&&this.instance._intersectsWith(this.instance.containerCache)&&t.contains(o.instance.element[0],this.instance.element[0])&&(a=!1),a})),a?(this.instance.isOver||(this.instance.isOver=1,this.instance.currentItem=t(n).clone().removeAttr("id").appendTo(this.instance.element).data("ui-sortable-item",!0),this.instance.options._helper=this.instance.options.helper,this.instance.options.helper=function(){return i.helper[0]},e.target=this.instance.currentItem[0],this.instance._mouseCapture(e,!0),this.instance._mouseStart(e,!0,!0),this.instance.offset.click.top=s.offset.click.top,this.instance.offset.click.left=s.offset.click.left,this.instance.offset.parent.left-=s.offset.parent.left-this.instance.offset.parent.left,this.instance.offset.parent.top-=s.offset.parent.top-this.instance.offset.parent.top,s._trigger("toSortable",e),s.dropped=this.instance.element,s.currentItem=s.element,this.instance.fromOutside=s),this.instance.currentItem&&this.instance._mouseDrag(e)):this.instance.isOver&&(this.instance.isOver=0,this.instance.cancelHelperRemoval=!0,this.instance.options.revert=!1,this.instance._trigger("out",e,this.instance._uiHash(this.instance)),this.instance._mouseStop(e,!0),this.instance.options.helper=this.instance.options._helper,this.instance.currentItem.remove(),this.instance.placeholder&&this.instance.placeholder.remove(),s._trigger("fromSortable",e),s.dropped=!1)})}}),t.ui.plugin.add("draggable","cursor",{start:function(){var e=t("body"),i=t(this).data("ui-draggable").options;e.css("cursor")&&(i._cursor=e.css("cursor")),e.css("cursor",i.cursor)},stop:function(){var e=t(this).data("ui-draggable").options;e._cursor&&t("body").css("cursor",e._cursor)}}),t.ui.plugin.add("draggable","opacity",{start:function(e,i){var s=t(i.helper),n=t(this).data("ui-draggable").options;s.css("opacity")&&(n._opacity=s.css("opacity")),s.css("opacity",n.opacity)},stop:function(e,i){var s=t(this).data("ui-draggable").options;s._opacity&&t(i.helper).css("opacity",s._opacity)}}),t.ui.plugin.add("draggable","scroll",{start:function(){var e=t(this).data("ui-draggable");e.scrollParent[0]!==document&&"HTML"!==e.scrollParent[0].tagName&&(e.overflowOffset=e.scrollParent.offset())},drag:function(e){var i=t(this).data("ui-draggable"),s=i.options,n=!1;i.scrollParent[0]!==document&&"HTML"!==i.scrollParent[0].tagName?(s.axis&&"x"===s.axis||(i.overflowOffset.top+i.scrollParent[0].offsetHeight-e.pageY<s.scrollSensitivity?i.scrollParent[0].scrollTop=n=i.scrollParent[0].scrollTop+s.scrollSpeed:e.pageY-i.overflowOffset.top<s.scrollSensitivity&&(i.scrollParent[0].scrollTop=n=i.scrollParent[0].scrollTop-s.scrollSpeed)),s.axis&&"y"===s.axis||(i.overflowOffset.left+i.scrollParent[0].offsetWidth-e.pageX<s.scrollSensitivity?i.scrollParent[0].scrollLeft=n=i.scrollParent[0].scrollLeft+s.scrollSpeed:e.pageX-i.overflowOffset.left<s.scrollSensitivity&&(i.scrollParent[0].scrollLeft=n=i.scrollParent[0].scrollLeft-s.scrollSpeed))):(s.axis&&"x"===s.axis||(e.pageY-t(document).scrollTop()<s.scrollSensitivity?n=t(document).scrollTop(t(document).scrollTop()-s.scrollSpeed):t(window).height()-(e.pageY-t(document).scrollTop())<s.scrollSensitivity&&(n=t(document).scrollTop(t(document).scrollTop()+s.scrollSpeed))),s.axis&&"y"===s.axis||(e.pageX-t(document).scrollLeft()<s.scrollSensitivity?n=t(document).scrollLeft(t(document).scrollLeft()-s.scrollSpeed):t(window).width()-(e.pageX-t(document).scrollLeft())<s.scrollSensitivity&&(n=t(document).scrollLeft(t(document).scrollLeft()+s.scrollSpeed)))),n!==!1&&t.ui.ddmanager&&!s.dropBehaviour&&t.ui.ddmanager.prepareOffsets(i,e)}}),t.ui.plugin.add("draggable","snap",{start:function(){var e=t(this).data("ui-draggable"),i=e.options;e.snapElements=[],t(i.snap.constructor!==String?i.snap.items||":data(ui-draggable)":i.snap).each(function(){var i=t(this),s=i.offset();this!==e.element[0]&&e.snapElements.push({item:this,width:i.outerWidth(),height:i.outerHeight(),top:s.top,left:s.left})})},drag:function(e,i){var s,n,a,o,r,l,h,c,u,d,p=t(this).data("ui-draggable"),f=p.options,g=f.snapTolerance,m=i.offset.left,v=m+p.helperProportions.width,_=i.offset.top,b=_+p.helperProportions.height;for(u=p.snapElements.length-1;u>=0;u--)r=p.snapElements[u].left,l=r+p.snapElements[u].width,h=p.snapElements[u].top,c=h+p.snapElements[u].height,r-g>v||m>l+g||h-g>b||_>c+g||!t.contains(p.snapElements[u].item.ownerDocument,p.snapElements[u].item)?(p.snapElements[u].snapping&&p.options.snap.release&&p.options.snap.release.call(p.element,e,t.extend(p._uiHash(),{snapItem:p.snapElements[u].item})),p.snapElements[u].snapping=!1):("inner"!==f.snapMode&&(s=g>=Math.abs(h-b),n=g>=Math.abs(c-_),a=g>=Math.abs(r-v),o=g>=Math.abs(l-m),s&&(i.position.top=p._convertPositionTo("relative",{top:h-p.helperProportions.height,left:0}).top-p.margins.top),n&&(i.position.top=p._convertPositionTo("relative",{top:c,left:0}).top-p.margins.top),a&&(i.position.left=p._convertPositionTo("relative",{top:0,left:r-p.helperProportions.width}).left-p.margins.left),o&&(i.position.left=p._convertPositionTo("relative",{top:0,left:l}).left-p.margins.left)),d=s||n||a||o,"outer"!==f.snapMode&&(s=g>=Math.abs(h-_),n=g>=Math.abs(c-b),a=g>=Math.abs(r-m),o=g>=Math.abs(l-v),s&&(i.position.top=p._convertPositionTo("relative",{top:h,left:0}).top-p.margins.top),n&&(i.position.top=p._convertPositionTo("relative",{top:c-p.helperProportions.height,left:0}).top-p.margins.top),a&&(i.position.left=p._convertPositionTo("relative",{top:0,left:r}).left-p.margins.left),o&&(i.position.left=p._convertPositionTo("relative",{top:0,left:l-p.helperProportions.width}).left-p.margins.left)),!p.snapElements[u].snapping&&(s||n||a||o||d)&&p.options.snap.snap&&p.options.snap.snap.call(p.element,e,t.extend(p._uiHash(),{snapItem:p.snapElements[u].item})),p.snapElements[u].snapping=s||n||a||o||d)}}),t.ui.plugin.add("draggable","stack",{start:function(){var e,i=this.data("ui-draggable").options,s=t.makeArray(t(i.stack)).sort(function(e,i){return(parseInt(t(e).css("zIndex"),10)||0)-(parseInt(t(i).css("zIndex"),10)||0)});s.length&&(e=parseInt(t(s[0]).css("zIndex"),10)||0,t(s).each(function(i){t(this).css("zIndex",e+i)}),this.css("zIndex",e+s.length))}}),t.ui.plugin.add("draggable","zIndex",{start:function(e,i){var s=t(i.helper),n=t(this).data("ui-draggable").options;s.css("zIndex")&&(n._zIndex=s.css("zIndex")),s.css("zIndex",n.zIndex)},stop:function(e,i){var s=t(this).data("ui-draggable").options;s._zIndex&&t(i.helper).css("zIndex",s._zIndex)}})}
(jQuery),function(t){function e(t,e,i){return t>e&&e+i>t}t.widget("ui.droppable",{version:"1.10.3",widgetEventPrefix:"drop",options:{accept:"*",activeClass:!1,addClasses:!0,greedy:!1,hoverClass:!1,scope:"default",tolerance:"intersect",activate:null,deactivate:null,drop:null,out:null,over:null},_create:function(){var e=this.options,i=e.accept;this.isover=!1,this.isout=!0,this.accept=t.isFunction(i)?i:function(t){return t.is(i)},this.proportions={width:this.element[0].offsetWidth,height:this.element[0].offsetHeight},t.ui.ddmanager.droppables[e.scope]=t.ui.ddmanager.droppables[e.scope]||[],t.ui.ddmanager.droppables[e.scope].push(this),e.addClasses&&this.element.addClass("ui-droppable")},_destroy:function(){for(var e=0,i=t.ui.ddmanager.droppables[this.options.scope];i.length>e;e++)i[e]===this&&i.splice(e,1);this.element.removeClass("ui-droppable ui-droppable-disabled")},_setOption:function(e,i){"accept"===e&&(this.accept=t.isFunction(i)?i:function(t){return t.is(i)}),t.Widget.prototype._setOption.apply(this,arguments)},_activate:function(e){var i=t.ui.ddmanager.current;this.options.activeClass&&this.element.addClass(this.options.activeClass),i&&this._trigger("activate",e,this.ui(i))},_deactivate:function(e){var i=t.ui.ddmanager.current;this.options.activeClass&&this.element.removeClass(this.options.activeClass),i&&this._trigger("deactivate",e,this.ui(i))},_over:function(e){var i=t.ui.ddmanager.current;i&&(i.currentItem||i.element)[0]!==this.element[0]&&this.accept.call(this.element[0],i.currentItem||i.element)&&(this.options.hoverClass&&this.element.addClass(this.options.hoverClass),this._trigger("over",e,this.ui(i)))},_out:function(e){var i=t.ui.ddmanager.current;i&&(i.currentItem||i.element)[0]!==this.element[0]&&this.accept.call(this.element[0],i.currentItem||i.element)&&(this.options.hoverClass&&this.element.removeClass(this.options.hoverClass),this._trigger("out",e,this.ui(i)))},_drop:function(e,i){var s=i||t.ui.ddmanager.current,n=!1;return s&&(s.currentItem||s.element)[0]!==this.element[0]?(this.element.find(":data(ui-droppable)").not(".ui-draggable-dragging").each(function(){var e=t.data(this,"ui-droppable");return e.options.greedy&&!e.options.disabled&&e.options.scope===s.options.scope&&e.accept.call(e.element[0],s.currentItem||s.element)&&t.ui.intersect(s,t.extend(e,{offset:e.element.offset()}),e.options.tolerance)?(n=!0,!1):void 0}),n?!1:this.accept.call(this.element[0],s.currentItem||s.element)?(this.options.activeClass&&this.element.removeClass(this.options.activeClass),this.options.hoverClass&&this.element.removeClass(this.options.hoverClass),this._trigger("drop",e,this.ui(s)),this.element):!1):!1},ui:function(t){return{draggable:t.currentItem||t.element,helper:t.helper,position:t.position,offset:t.positionAbs}}}),t.ui.intersect=function(t,i,s){if(!i.offset)return!1;var n,a,o=(t.positionAbs||t.position.absolute).left,r=o+t.helperProportions.width,l=(t.positionAbs||t.position.absolute).top,h=l+t.helperProportions.height,c=i.offset.left,u=c+i.proportions.width,d=i.offset.top,p=d+i.proportions.height;
    switch(s){case"fit":return o>=c&&u>=r&&l>=d&&p>=h;case"intersect":return o+t.helperProportions.width/2>c&&u>r-t.helperProportions.width/2&&l+t.helperProportions.height/2>d&&p>h-t.helperProportions.height/2;case"pointer":return n=(t.positionAbs||t.position.absolute).left+(t.clickOffset||t.offset.click).left,a=(t.positionAbs||t.position.absolute).top+(t.clickOffset||t.offset.click).top,e(a,d,i.proportions.height)&&e(n,c,i.proportions.width);case"touch":return(l>=d&&p>=l||h>=d&&p>=h||d>l&&h>p)&&(o>=c&&u>=o||r>=c&&u>=r||c>o&&r>u);default:return!1}},t.ui.ddmanager={current:null,droppables:{"default":[]},prepareOffsets:function(e,i){var s,n,a=t.ui.ddmanager.droppables[e.options.scope]||[],o=i?i.type:null,r=(e.currentItem||e.element).find(":data(ui-droppable)").addBack();t:for(s=0;a.length>s;s++)if(!(a[s].options.disabled||e&&!a[s].accept.call(a[s].element[0],e.currentItem||e.element))){for(n=0;r.length>n;n++)if(r[n]===a[s].element[0]){a[s].proportions.height=0;continue t}a[s].visible="none"!==a[s].element.css("display"),a[s].visible&&("mousedown"===o&&a[s]._activate.call(a[s],i),a[s].offset=a[s].element.offset(),a[s].proportions={width:a[s].element[0].offsetWidth,height:a[s].element[0].offsetHeight})}},drop:function(e,i){var s=!1;return t.each((t.ui.ddmanager.droppables[e.options.scope]||[]).slice(),function(){this.options&&(!this.options.disabled&&this.visible&&t.ui.intersect(e,this,this.options.tolerance)&&(s=this._drop.call(this,i)||s),!this.options.disabled&&this.visible&&this.accept.call(this.element[0],e.currentItem||e.element)&&(this.isout=!0,this.isover=!1,this._deactivate.call(this,i)))}),s},dragStart:function(e,i){e.element.parentsUntil("body").bind("scroll.droppable",function(){e.options.refreshPositions||t.ui.ddmanager.prepareOffsets(e,i)})},drag:function(e,i){e.options.refreshPositions&&t.ui.ddmanager.prepareOffsets(e,i),t.each(t.ui.ddmanager.droppables[e.options.scope]||[],function(){if(!this.options.disabled&&!this.greedyChild&&this.visible){var s,n,a,o=t.ui.intersect(e,this,this.options.tolerance),r=!o&&this.isover?"isout":o&&!this.isover?"isover":null;r&&(this.options.greedy&&(n=this.options.scope,a=this.element.parents(":data(ui-droppable)").filter(function(){return t.data(this,"ui-droppable").options.scope===n}),a.length&&(s=t.data(a[0],"ui-droppable"),s.greedyChild="isover"===r)),s&&"isover"===r&&(s.isover=!1,s.isout=!0,s._out.call(s,i)),this[r]=!0,this["isout"===r?"isover":"isout"]=!1,this["isover"===r?"_over":"_out"].call(this,i),s&&"isout"===r&&(s.isout=!1,s.isover=!0,s._over.call(s,i)))}})},dragStop:function(e,i){e.element.parentsUntil("body").unbind("scroll.droppable"),e.options.refreshPositions||t.ui.ddmanager.prepareOffsets(e,i)}}}
(jQuery),function(t){function e(t){return parseInt(t,10)||0}function i(t){return!isNaN(parseInt(t,10))}t.widget("ui.resizable",t.ui.mouse,{version:"1.10.3",widgetEventPrefix:"resize",options:{alsoResize:!1,animate:!1,animateDuration:"slow",animateEasing:"swing",aspectRatio:!1,autoHide:!1,containment:!1,ghost:!1,grid:!1,handles:"e,s,se",helper:!1,maxHeight:null,maxWidth:null,minHeight:10,minWidth:10,zIndex:90,resize:null,start:null,stop:null},_create:function(){var e,i,s,n,a,o=this,r=this.options;if(this.element.addClass("ui-resizable"),t.extend(this,{_aspectRatio:!!r.aspectRatio,aspectRatio:r.aspectRatio,originalElement:this.element,_proportionallyResizeElements:[],_helper:r.helper||r.ghost||r.animate?r.helper||"ui-resizable-helper":null}),this.element[0].nodeName.match(/canvas|textarea|input|select|button|img/i)&&(this.element.wrap(t("<div class='ui-wrapper' style='overflow: hidden;'></div>").css({position:this.element.css("position"),width:this.element.outerWidth(),height:this.element.outerHeight(),top:this.element.css("top"),left:this.element.css("left")})),this.element=this.element.parent().data("ui-resizable",this.element.data("ui-resizable")),this.elementIsWrapper=!0,this.element.css({marginLeft:this.originalElement.css("marginLeft"),marginTop:this.originalElement.css("marginTop"),marginRight:this.originalElement.css("marginRight"),marginBottom:this.originalElement.css("marginBottom")}),this.originalElement.css({marginLeft:0,marginTop:0,marginRight:0,marginBottom:0}),this.originalResizeStyle=this.originalElement.css("resize"),this.originalElement.css("resize","none"),this._proportionallyResizeElements.push(this.originalElement.css({position:"static",zoom:1,display:"block"})),this.originalElement.css({margin:this.originalElement.css("margin")}),this._proportionallyResize()),this.handles=r.handles||(t(".ui-resizable-handle",this.element).length?{n:".ui-resizable-n",e:".ui-resizable-e",s:".ui-resizable-s",w:".ui-resizable-w",se:".ui-resizable-se",sw:".ui-resizable-sw",ne:".ui-resizable-ne",nw:".ui-resizable-nw"}:"e,s,se"),this.handles.constructor===String)for("all"===this.handles&&(this.handles="n,e,s,w,se,sw,ne,nw"),e=this.handles.split(","),this.handles={},i=0;e.length>i;i++)s=t.trim(e[i]),a="ui-resizable-"+s,n=t("<div class='ui-resizable-handle "+a+"'></div>"),n.css({zIndex:r.zIndex}),"se"===s&&n.addClass("ui-icon ui-icon-gripsmall-diagonal-se"),this.handles[s]=".ui-resizable-"+s,this.element.append(n);this._renderAxis=function(e){var i,s,n,a;e=e||this.element;for(i in this.handles)this.handles[i].constructor===String&&(this.handles[i]=t(this.handles[i],this.element).show()),this.elementIsWrapper&&this.originalElement[0].nodeName.match(/textarea|input|select|button/i)&&(s=t(this.handles[i],this.element),a=/sw|ne|nw|se|n|s/.test(i)?s.outerHeight():s.outerWidth(),n=["padding",/ne|nw|n/.test(i)?"Top":/se|sw|s/.test(i)?"Bottom":/^e$/.test(i)?"Right":"Left"].join(""),e.css(n,a),this._proportionallyResize()),t(this.handles[i]).length},this._renderAxis(this.element),this._handles=t(".ui-resizable-handle",this.element).disableSelection(),this._handles.mouseover(function(){o.resizing||(this.className&&(n=this.className.match(/ui-resizable-(se|sw|ne|nw|n|e|s|w)/i)),o.axis=n&&n[1]?n[1]:"se")}),r.autoHide&&(this._handles.hide(),t(this.element).addClass("ui-resizable-autohide").mouseenter(function(){r.disabled||(t(this).removeClass("ui-resizable-autohide"),o._handles.show())}).mouseleave(function(){r.disabled||o.resizing||(t(this).addClass("ui-resizable-autohide"),o._handles.hide())})),this._mouseInit()},_destroy:function(){this._mouseDestroy();var e,i=function(e){t(e).removeClass("ui-resizable ui-resizable-disabled ui-resizable-resizing").removeData("resizable").removeData("ui-resizable").unbind(".resizable").find(".ui-resizable-handle").remove()};return this.elementIsWrapper&&(i(this.element),e=this.element,this.originalElement.css({position:e.css("position"),width:e.outerWidth(),height:e.outerHeight(),top:e.css("top"),left:e.css("left")}).insertAfter(e),e.remove()),this.originalElement.css("resize",this.originalResizeStyle),i(this.originalElement),this},_mouseCapture:function(e){var i,s,n=!1;for(i in this.handles)s=t(this.handles[i])[0],(s===e.target||t.contains(s,e.target))&&(n=!0);return!this.options.disabled&&n},_mouseStart:function(i){var s,n,a,o=this.options,r=this.element.position(),l=this.element;return this.resizing=!0,/absolute/.test(l.css("position"))?l.css({position:"absolute",top:l.css("top"),left:l.css("left")}):l.is(".ui-draggable")&&l.css({position:"absolute",top:r.top,left:r.left}),this._renderProxy(),s=e(this.helper.css("left")),n=e(this.helper.css("top")),o.containment&&(s+=t(o.containment).scrollLeft()||0,n+=t(o.containment).scrollTop()||0),this.offset=this.helper.offset(),this.position={left:s,top:n},this.size=this._helper?{width:l.outerWidth(),height:l.outerHeight()}:{width:l.width(),height:l.height()},this.originalSize=this._helper?{width:l.outerWidth(),height:l.outerHeight()}:{width:l.width(),height:l.height()},this.originalPosition={left:s,top:n},this.sizeDiff={width:l.outerWidth()-l.width(),height:l.outerHeight()-l.height()},this.originalMousePosition={left:i.pageX,top:i.pageY},this.aspectRatio="number"==typeof o.aspectRatio?o.aspectRatio:this.originalSize.width/this.originalSize.height||1,a=t(".ui-resizable-"+this.axis).css("cursor"),t("body").css("cursor","auto"===a?this.axis+"-resize":a),l.addClass("ui-resizable-resizing"),this._propagate("start",i),!0},_mouseDrag:function(e){var i,s=this.helper,n={},a=this.originalMousePosition,o=this.axis,r=this.position.top,l=this.position.left,h=this.size.width,c=this.size.height,u=e.pageX-a.left||0,d=e.pageY-a.top||0,p=this._change[o];return p?(i=p.apply(this,[e,u,d]),this._updateVirtualBoundaries(e.shiftKey),(this._aspectRatio||e.shiftKey)&&(i=this._updateRatio(i,e)),i=this._respectSize(i,e),this._updateCache(i),this._propagate("resize",e),this.position.top!==r&&(n.top=this.position.top+"px"),this.position.left!==l&&(n.left=this.position.left+"px"),this.size.width!==h&&(n.width=this.size.width+"px"),this.size.height!==c&&(n.height=this.size.height+"px"),s.css(n),!this._helper&&this._proportionallyResizeElements.length&&this._proportionallyResize(),t.isEmptyObject(n)||this._trigger("resize",e,this.ui()),!1):!1},_mouseStop:function(e){this.resizing=!1;var i,s,n,a,o,r,l,h=this.options,c=this;return this._helper&&(i=this._proportionallyResizeElements,s=i.length&&/textarea/i.test(i[0].nodeName),n=s&&t.ui.hasScroll(i[0],"left")?0:c.sizeDiff.height,a=s?0:c.sizeDiff.width,o={width:c.helper.width()-a,height:c.helper.height()-n},r=parseInt(c.element.css("left"),10)+(c.position.left-c.originalPosition.left)||null,l=parseInt(c.element.css("top"),10)+(c.position.top-c.originalPosition.top)||null,h.animate||this.element.css(t.extend(o,{top:l,left:r})),c.helper.height(c.size.height),c.helper.width(c.size.width),this._helper&&!h.animate&&this._proportionallyResize()),t("body").css("cursor","auto"),this.element.removeClass("ui-resizable-resizing"),this._propagate("stop",e),this._helper&&this.helper.remove(),!1},_updateVirtualBoundaries:function(t){var e,s,n,a,o,r=this.options;o={minWidth:i(r.minWidth)?r.minWidth:0,maxWidth:i(r.maxWidth)?r.maxWidth:1/0,minHeight:i(r.minHeight)?r.minHeight:0,maxHeight:i(r.maxHeight)?r.maxHeight:1/0},(this._aspectRatio||t)&&(e=o.minHeight*this.aspectRatio,n=o.minWidth/this.aspectRatio,s=o.maxHeight*this.aspectRatio,a=o.maxWidth/this.aspectRatio,e>o.minWidth&&(o.minWidth=e),n>o.minHeight&&(o.minHeight=n),o.maxWidth>s&&(o.maxWidth=s),o.maxHeight>a&&(o.maxHeight=a)),this._vBoundaries=o},_updateCache:function(t){this.offset=this.helper.offset(),i(t.left)&&(this.position.left=t.left),i(t.top)&&(this.position.top=t.top),i(t.height)&&(this.size.height=t.height),i(t.width)&&(this.size.width=t.width)},_updateRatio:function(t){var e=this.position,s=this.size,n=this.axis;return i(t.height)?t.width=t.height*this.aspectRatio:i(t.width)&&(t.height=t.width/this.aspectRatio),"sw"===n&&(t.left=e.left+(s.width-t.width),t.top=null),"nw"===n&&(t.top=e.top+(s.height-t.height),t.left=e.left+(s.width-t.width)),t},_respectSize:function(t){var e=this._vBoundaries,s=this.axis,n=i(t.width)&&e.maxWidth&&e.maxWidth<t.width,a=i(t.height)&&e.maxHeight&&e.maxHeight<t.height,o=i(t.width)&&e.minWidth&&e.minWidth>t.width,r=i(t.height)&&e.minHeight&&e.minHeight>t.height,l=this.originalPosition.left+this.originalSize.width,h=this.position.top+this.size.height,c=/sw|nw|w/.test(s),u=/nw|ne|n/.test(s);return o&&(t.width=e.minWidth),r&&(t.height=e.minHeight),n&&(t.width=e.maxWidth),a&&(t.height=e.maxHeight),o&&c&&(t.left=l-e.minWidth),n&&c&&(t.left=l-e.maxWidth),r&&u&&(t.top=h-e.minHeight),a&&u&&(t.top=h-e.maxHeight),t.width||t.height||t.left||!t.top?t.width||t.height||t.top||!t.left||(t.left=null):t.top=null,t},_proportionallyResize:function(){if(this._proportionallyResizeElements.length){var t,e,i,s,n,a=this.helper||this.element;for(t=0;this._proportionallyResizeElements.length>t;t++){if(n=this._proportionallyResizeElements[t],!this.borderDif)for(this.borderDif=[],i=[n.css("borderTopWidth"),n.css("borderRightWidth"),n.css("borderBottomWidth"),n.css("borderLeftWidth")],s=[n.css("paddingTop"),n.css("paddingRight"),n.css("paddingBottom"),n.css("paddingLeft")],e=0;i.length>e;e++)this.borderDif[e]=(parseInt(i[e],10)||0)+(parseInt(s[e],10)||0);n.css({height:a.height()-this.borderDif[0]-this.borderDif[2]||0,width:a.width()-this.borderDif[1]-this.borderDif[3]||0})}}},_renderProxy:function(){var e=this.element,i=this.options;this.elementOffset=e.offset(),this._helper?(this.helper=this.helper||t("<div style='overflow:hidden;'></div>"),this.helper.addClass(this._helper).css({width:this.element.outerWidth()-1,height:this.element.outerHeight()-1,position:"absolute",left:this.elementOffset.left+"px",top:this.elementOffset.top+"px",zIndex:++i.zIndex}),this.helper.appendTo("body").disableSelection()):this.helper=this.element},_change:{e:function(t,e){return{width:this.originalSize.width+e}},w:function(t,e){var i=this.originalSize,s=this.originalPosition;return{left:s.left+e,width:i.width-e}},n:function(t,e,i){var s=this.originalSize,n=this.originalPosition;return{top:n.top+i,height:s.height-i}},s:function(t,e,i){return{height:this.originalSize.height+i}},se:function(e,i,s){return t.extend(this._change.s.apply(this,arguments),this._change.e.apply(this,[e,i,s]))},sw:function(e,i,s){return t.extend(this._change.s.apply(this,arguments),this._change.w.apply(this,[e,i,s]))},ne:function(e,i,s){return t.extend(this._change.n.apply(this,arguments),this._change.e.apply(this,[e,i,s]))},nw:function(e,i,s){return t.extend(this._change.n.apply(this,arguments),this._change.w.apply(this,[e,i,s]))}},_propagate:function(e,i){t.ui.plugin.call(this,e,[i,this.ui()]),"resize"!==e&&this._trigger(e,i,this.ui())},plugins:{},ui:function(){return{originalElement:this.originalElement,element:this.element,helper:this.helper,position:this.position,size:this.size,originalSize:this.originalSize,originalPosition:this.originalPosition}}}),t.ui.plugin.add("resizable","animate",{stop:function(e){var i=t(this).data("ui-resizable"),s=i.options,n=i._proportionallyResizeElements,a=n.length&&/textarea/i.test(n[0].nodeName),o=a&&t.ui.hasScroll(n[0],"left")?0:i.sizeDiff.height,r=a?0:i.sizeDiff.width,l={width:i.size.width-r,height:i.size.height-o},h=parseInt(i.element.css("left"),10)+(i.position.left-i.originalPosition.left)||null,c=parseInt(i.element.css("top"),10)+(i.position.top-i.originalPosition.top)||null;i.element.animate(t.extend(l,c&&h?{top:c,left:h}:{}),{duration:s.animateDuration,easing:s.animateEasing,step:function(){var s={width:parseInt(i.element.css("width"),10),height:parseInt(i.element.css("height"),10),top:parseInt(i.element.css("top"),10),left:parseInt(i.element.css("left"),10)};n&&n.length&&t(n[0]).css({width:s.width,height:s.height}),i._updateCache(s),i._propagate("resize",e)}})}}),t.ui.plugin.add("resizable","containment",{start:function(){var i,s,n,a,o,r,l,h=t(this).data("ui-resizable"),c=h.options,u=h.element,d=c.containment,p=d instanceof t?d.get(0):/parent/.test(d)?u.parent().get(0):d;p&&(h.containerElement=t(p),/document/.test(d)||d===document?(h.containerOffset={left:0,top:0},h.containerPosition={left:0,top:0},h.parentData={element:t(document),left:0,top:0,width:t(document).width(),height:t(document).height()||document.body.parentNode.scrollHeight}):(i=t(p),s=[],t(["Top","Right","Left","Bottom"]).each(function(t,n){s[t]=e(i.css("padding"+n))}),h.containerOffset=i.offset(),h.containerPosition=i.position(),h.containerSize={height:i.innerHeight()-s[3],width:i.innerWidth()-s[1]},n=h.containerOffset,a=h.containerSize.height,o=h.containerSize.width,r=t.ui.hasScroll(p,"left")?p.scrollWidth:o,l=t.ui.hasScroll(p)?p.scrollHeight:a,h.parentData={element:p,left:n.left,top:n.top,width:r,height:l}))},resize:function(e){var i,s,n,a,o=t(this).data("ui-resizable"),r=o.options,l=o.containerOffset,h=o.position,c=o._aspectRatio||e.shiftKey,u={top:0,left:0},d=o.containerElement;d[0]!==document&&/static/.test(d.css("position"))&&(u=l),h.left<(o._helper?l.left:0)&&(o.size.width=o.size.width+(o._helper?o.position.left-l.left:o.position.left-u.left),c&&(o.size.height=o.size.width/o.aspectRatio),o.position.left=r.helper?l.left:0),h.top<(o._helper?l.top:0)&&(o.size.height=o.size.height+(o._helper?o.position.top-l.top:o.position.top),c&&(o.size.width=o.size.height*o.aspectRatio),o.position.top=o._helper?l.top:0),o.offset.left=o.parentData.left+o.position.left,o.offset.top=o.parentData.top+o.position.top,i=Math.abs((o._helper?o.offset.left-u.left:o.offset.left-u.left)+o.sizeDiff.width),s=Math.abs((o._helper?o.offset.top-u.top:o.offset.top-l.top)+o.sizeDiff.height),n=o.containerElement.get(0)===o.element.parent().get(0),a=/relative|absolute/.test(o.containerElement.css("position")),n&&a&&(i-=o.parentData.left),i+o.size.width>=o.parentData.width&&(o.size.width=o.parentData.width-i,c&&(o.size.height=o.size.width/o.aspectRatio)),s+o.size.height>=o.parentData.height&&(o.size.height=o.parentData.height-s,c&&(o.size.width=o.size.height*o.aspectRatio))},stop:function(){var e=t(this).data("ui-resizable"),i=e.options,s=e.containerOffset,n=e.containerPosition,a=e.containerElement,o=t(e.helper),r=o.offset(),l=o.outerWidth()-e.sizeDiff.width,h=o.outerHeight()-e.sizeDiff.height;e._helper&&!i.animate&&/relative/.test(a.css("position"))&&t(this).css({left:r.left-n.left-s.left,width:l,height:h}),e._helper&&!i.animate&&/static/.test(a.css("position"))&&t(this).css({left:r.left-n.left-s.left,width:l,height:h})}}),t.ui.plugin.add("resizable","alsoResize",{start:function(){var e=t(this).data("ui-resizable"),i=e.options,s=function(e){t(e).each(function(){var e=t(this);e.data("ui-resizable-alsoresize",{width:parseInt(e.width(),10),height:parseInt(e.height(),10),left:parseInt(e.css("left"),10),top:parseInt(e.css("top"),10)})})};"object"!=typeof i.alsoResize||i.alsoResize.parentNode?s(i.alsoResize):i.alsoResize.length?(i.alsoResize=i.alsoResize[0],s(i.alsoResize)):t.each(i.alsoResize,function(t){s(t)})},resize:function(e,i){var s=t(this).data("ui-resizable"),n=s.options,a=s.originalSize,o=s.originalPosition,r={height:s.size.height-a.height||0,width:s.size.width-a.width||0,top:s.position.top-o.top||0,left:s.position.left-o.left||0},l=function(e,s){t(e).each(function(){var e=t(this),n=t(this).data("ui-resizable-alsoresize"),a={},o=s&&s.length?s:e.parents(i.originalElement[0]).length?["width","height"]:["width","height","top","left"];t.each(o,function(t,e){var i=(n[e]||0)+(r[e]||0);i&&i>=0&&(a[e]=i||null)}),e.css(a)})};"object"!=typeof n.alsoResize||n.alsoResize.nodeType?l(n.alsoResize):t.each(n.alsoResize,function(t,e){l(t,e)})},stop:function(){t(this).removeData("resizable-alsoresize")}}),t.ui.plugin.add("resizable","ghost",{start:function(){var e=t(this).data("ui-resizable"),i=e.options,s=e.size;e.ghost=e.originalElement.clone(),e.ghost.css({opacity:.25,display:"block",position:"relative",height:s.height,width:s.width,margin:0,left:0,top:0}).addClass("ui-resizable-ghost").addClass("string"==typeof i.ghost?i.ghost:""),e.ghost.appendTo(e.helper)},resize:function(){var e=t(this).data("ui-resizable");e.ghost&&e.ghost.css({position:"relative",height:e.size.height,width:e.size.width})},stop:function(){var e=t(this).data("ui-resizable");e.ghost&&e.helper&&e.helper.get(0).removeChild(e.ghost.get(0))}}),t.ui.plugin.add("resizable","grid",{resize:function(){var e=t(this).data("ui-resizable"),i=e.options,s=e.size,n=e.originalSize,a=e.originalPosition,o=e.axis,r="number"==typeof i.grid?[i.grid,i.grid]:i.grid,l=r[0]||1,h=r[1]||1,c=Math.round((s.width-n.width)/l)*l,u=Math.round((s.height-n.height)/h)*h,d=n.width+c,p=n.height+u,f=i.maxWidth&&d>i.maxWidth,g=i.maxHeight&&p>i.maxHeight,m=i.minWidth&&i.minWidth>d,v=i.minHeight&&i.minHeight>p;i.grid=r,m&&(d+=l),v&&(p+=h),f&&(d-=l),g&&(p-=h),/^(se|s|e)$/.test(o)?(e.size.width=d,e.size.height=p):/^(ne)$/.test(o)?(e.size.width=d,e.size.height=p,e.position.top=a.top-u):/^(sw)$/.test(o)?(e.size.width=d,e.size.height=p,e.position.left=a.left-c):(e.size.width=d,e.size.height=p,e.position.top=a.top-u,e.position.left=a.left-c)}})}
(jQuery),function(t){t.widget("ui.selectable",t.ui.mouse,{version:"1.10.3",options:{appendTo:"body",autoRefresh:!0,distance:0,filter:"*",tolerance:"touch",selected:null,selecting:null,start:null,stop:null,unselected:null,unselecting:null},_create:function(){var e,i=this;this.element.addClass("ui-selectable"),this.dragged=!1,this.refresh=function(){e=t(i.options.filter,i.element[0]),e.addClass("ui-selectee"),e.each(function(){var e=t(this),i=e.offset();t.data(this,"selectable-item",{element:this,$element:e,left:i.left,top:i.top,right:i.left+e.outerWidth(),bottom:i.top+e.outerHeight(),startselected:!1,selected:e.hasClass("ui-selected"),selecting:e.hasClass("ui-selecting"),unselecting:e.hasClass("ui-unselecting")})})},this.refresh(),this.selectees=e.addClass("ui-selectee"),this._mouseInit(),this.helper=t("<div class='ui-selectable-helper'></div>")},_destroy:function(){this.selectees.removeClass("ui-selectee").removeData("selectable-item"),this.element.removeClass("ui-selectable ui-selectable-disabled"),this._mouseDestroy()},_mouseStart:function(e){var i=this,s=this.options;this.opos=[e.pageX,e.pageY],this.options.disabled||(this.selectees=t(s.filter,this.element[0]),this._trigger("start",e),t(s.appendTo).append(this.helper),this.helper.css({left:e.pageX,top:e.pageY,width:0,height:0}),s.autoRefresh&&this.refresh(),this.selectees.filter(".ui-selected").each(function(){var s=t.data(this,"selectable-item");s.startselected=!0,e.metaKey||e.ctrlKey||(s.$element.removeClass("ui-selected"),s.selected=!1,s.$element.addClass("ui-unselecting"),s.unselecting=!0,i._trigger("unselecting",e,{unselecting:s.element}))}),t(e.target).parents().addBack().each(function(){var s,n=t.data(this,"selectable-item");return n?(s=!e.metaKey&&!e.ctrlKey||!n.$element.hasClass("ui-selected"),n.$element.removeClass(s?"ui-unselecting":"ui-selected").addClass(s?"ui-selecting":"ui-unselecting"),n.unselecting=!s,n.selecting=s,n.selected=s,s?i._trigger("selecting",e,{selecting:n.element}):i._trigger("unselecting",e,{unselecting:n.element}),!1):void 0}))},_mouseDrag:function(e){if(this.dragged=!0,!this.options.disabled){var i,s=this,n=this.options,a=this.opos[0],o=this.opos[1],r=e.pageX,l=e.pageY;return a>r&&(i=r,r=a,a=i),o>l&&(i=l,l=o,o=i),this.helper.css({left:a,top:o,width:r-a,height:l-o}),this.selectees.each(function(){var i=t.data(this,"selectable-item"),h=!1;i&&i.element!==s.element[0]&&("touch"===n.tolerance?h=!(i.left>r||a>i.right||i.top>l||o>i.bottom):"fit"===n.tolerance&&(h=i.left>a&&r>i.right&&i.top>o&&l>i.bottom),h?(i.selected&&(i.$element.removeClass("ui-selected"),i.selected=!1),i.unselecting&&(i.$element.removeClass("ui-unselecting"),i.unselecting=!1),i.selecting||(i.$element.addClass("ui-selecting"),i.selecting=!0,s._trigger("selecting",e,{selecting:i.element}))):(i.selecting&&((e.metaKey||e.ctrlKey)&&i.startselected?(i.$element.removeClass("ui-selecting"),i.selecting=!1,i.$element.addClass("ui-selected"),i.selected=!0):(i.$element.removeClass("ui-selecting"),i.selecting=!1,i.startselected&&(i.$element.addClass("ui-unselecting"),i.unselecting=!0),s._trigger("unselecting",e,{unselecting:i.element}))),i.selected&&(e.metaKey||e.ctrlKey||i.startselected||(i.$element.removeClass("ui-selected"),i.selected=!1,i.$element.addClass("ui-unselecting"),i.unselecting=!0,s._trigger("unselecting",e,{unselecting:i.element})))))}),!1}},_mouseStop:function(e){var i=this;return this.dragged=!1,t(".ui-unselecting",this.element[0]).each(function(){var s=t.data(this,"selectable-item");s.$element.removeClass("ui-unselecting"),s.unselecting=!1,s.startselected=!1,i._trigger("unselected",e,{unselected:s.element})}),t(".ui-selecting",this.element[0]).each(function(){var s=t.data(this,"selectable-item");s.$element.removeClass("ui-selecting").addClass("ui-selected"),s.selecting=!1,s.selected=!0,s.startselected=!0,i._trigger("selected",e,{selected:s.element})}),this._trigger("stop",e),this.helper.remove(),!1}})}
(jQuery),function(t){function e(t,e,i){return t>e&&e+i>t}function i(t){return/left|right/.test(t.css("float"))||/inline|table-cell/.test(t.css("display"))}t.widget("ui.sortable",t.ui.mouse,{version:"1.10.3",widgetEventPrefix:"sort",ready:!1,options:{appendTo:"parent",axis:!1,connectWith:!1,containment:!1,cursor:"auto",cursorAt:!1,dropOnEmpty:!0,forcePlaceholderSize:!1,forceHelperSize:!1,grid:!1,handle:!1,helper:"original",items:"> *",opacity:!1,placeholder:!1,revert:!1,scroll:!0,scrollSensitivity:20,scrollSpeed:20,scope:"default",tolerance:"intersect",zIndex:1e3,activate:null,beforeStop:null,change:null,deactivate:null,out:null,over:null,receive:null,remove:null,sort:null,start:null,stop:null,update:null},_create:function(){var t=this.options;this.containerCache={},this.element.addClass("ui-sortable"),this.refresh(),this.floating=this.items.length?"x"===t.axis||i(this.items[0].item):!1,this.offset=this.element.offset(),this._mouseInit(),this.ready=!0},_destroy:function(){this.element.removeClass("ui-sortable ui-sortable-disabled"),this._mouseDestroy();for(var t=this.items.length-1;t>=0;t--)this.items[t].item.removeData(this.widgetName+"-item");return this},_setOption:function(e,i){"disabled"===e?(this.options[e]=i,this.widget().toggleClass("ui-sortable-disabled",!!i)):t.Widget.prototype._setOption.apply(this,arguments)},_mouseCapture:function(e,i){var s=null,n=!1,a=this;return this.reverting?!1:this.options.disabled||"static"===this.options.type?!1:(this._refreshItems(e),t(e.target).parents().each(function(){return t.data(this,a.widgetName+"-item")===a?(s=t(this),!1):void 0}),t.data(e.target,a.widgetName+"-item")===a&&(s=t(e.target)),s?!this.options.handle||i||(t(this.options.handle,s).find("*").addBack().each(function(){this===e.target&&(n=!0)}),n)?(this.currentItem=s,this._removeCurrentsFromItems(),!0):!1:!1)},_mouseStart:function(e,i,s){var n,a,o=this.options;if(this.currentContainer=this,this.refreshPositions(),this.helper=this._createHelper(e),this._cacheHelperProportions(),this._cacheMargins(),this.scrollParent=this.helper.scrollParent(),this.offset=this.currentItem.offset(),this.offset={top:this.offset.top-this.margins.top,left:this.offset.left-this.margins.left},t.extend(this.offset,{click:{left:e.pageX-this.offset.left,top:e.pageY-this.offset.top},parent:this._getParentOffset(),relative:this._getRelativeOffset()}),this.helper.css("position","absolute"),this.cssPosition=this.helper.css("position"),this.originalPosition=this._generatePosition(e),this.originalPageX=e.pageX,this.originalPageY=e.pageY,o.cursorAt&&this._adjustOffsetFromHelper(o.cursorAt),this.domPosition={prev:this.currentItem.prev()[0],parent:this.currentItem.parent()[0]},this.helper[0]!==this.currentItem[0]&&this.currentItem.hide(),this._createPlaceholder(),o.containment&&this._setContainment(),o.cursor&&"auto"!==o.cursor&&(a=this.document.find("body"),this.storedCursor=a.css("cursor"),a.css("cursor",o.cursor),this.storedStylesheet=t("<style>*{ cursor: "+o.cursor+" !important; }</style>").appendTo(a)),o.opacity&&(this.helper.css("opacity")&&(this._storedOpacity=this.helper.css("opacity")),this.helper.css("opacity",o.opacity)),o.zIndex&&(this.helper.css("zIndex")&&(this._storedZIndex=this.helper.css("zIndex")),this.helper.css("zIndex",o.zIndex)),this.scrollParent[0]!==document&&"HTML"!==this.scrollParent[0].tagName&&(this.overflowOffset=this.scrollParent.offset()),this._trigger("start",e,this._uiHash()),this._preserveHelperProportions||this._cacheHelperProportions(),!s)for(n=this.containers.length-1;n>=0;n--)this.containers[n]._trigger("activate",e,this._uiHash(this));return t.ui.ddmanager&&(t.ui.ddmanager.current=this),t.ui.ddmanager&&!o.dropBehaviour&&t.ui.ddmanager.prepareOffsets(this,e),this.dragging=!0,this.helper.addClass("ui-sortable-helper"),this._mouseDrag(e),!0},_mouseDrag:function(e){var i,s,n,a,o=this.options,r=!1;for(this.position=this._generatePosition(e),this.positionAbs=this._convertPositionTo("absolute"),this.lastPositionAbs||(this.lastPositionAbs=this.positionAbs),this.options.scroll&&(this.scrollParent[0]!==document&&"HTML"!==this.scrollParent[0].tagName?(this.overflowOffset.top+this.scrollParent[0].offsetHeight-e.pageY<o.scrollSensitivity?this.scrollParent[0].scrollTop=r=this.scrollParent[0].scrollTop+o.scrollSpeed:e.pageY-this.overflowOffset.top<o.scrollSensitivity&&(this.scrollParent[0].scrollTop=r=this.scrollParent[0].scrollTop-o.scrollSpeed),this.overflowOffset.left+this.scrollParent[0].offsetWidth-e.pageX<o.scrollSensitivity?this.scrollParent[0].scrollLeft=r=this.scrollParent[0].scrollLeft+o.scrollSpeed:e.pageX-this.overflowOffset.left<o.scrollSensitivity&&(this.scrollParent[0].scrollLeft=r=this.scrollParent[0].scrollLeft-o.scrollSpeed)):(e.pageY-t(document).scrollTop()<o.scrollSensitivity?r=t(document).scrollTop(t(document).scrollTop()-o.scrollSpeed):t(window).height()-(e.pageY-t(document).scrollTop())<o.scrollSensitivity&&(r=t(document).scrollTop(t(document).scrollTop()+o.scrollSpeed)),e.pageX-t(document).scrollLeft()<o.scrollSensitivity?r=t(document).scrollLeft(t(document).scrollLeft()-o.scrollSpeed):t(window).width()-(e.pageX-t(document).scrollLeft())<o.scrollSensitivity&&(r=t(document).scrollLeft(t(document).scrollLeft()+o.scrollSpeed))),r!==!1&&t.ui.ddmanager&&!o.dropBehaviour&&t.ui.ddmanager.prepareOffsets(this,e)),this.positionAbs=this._convertPositionTo("absolute"),this.options.axis&&"y"===this.options.axis||(this.helper[0].style.left=this.position.left+"px"),this.options.axis&&"x"===this.options.axis||(this.helper[0].style.top=this.position.top+"px"),i=this.items.length-1;i>=0;i--)if(s=this.items[i],n=s.item[0],a=this._intersectsWithPointer(s),a&&s.instance===this.currentContainer&&n!==this.currentItem[0]&&this.placeholder[1===a?"next":"prev"]()[0]!==n&&!t.contains(this.placeholder[0],n)&&("semi-dynamic"===this.options.type?!t.contains(this.element[0],n):!0)){if(this.direction=1===a?"down":"up","pointer"!==this.options.tolerance&&!this._intersectsWithSides(s))break;this._rearrange(e,s),this._trigger("change",e,this._uiHash());break}return this._contactContainers(e),t.ui.ddmanager&&t.ui.ddmanager.drag(this,e),this._trigger("sort",e,this._uiHash()),this.lastPositionAbs=this.positionAbs,!1},_mouseStop:function(e,i){if(e){if(t.ui.ddmanager&&!this.options.dropBehaviour&&t.ui.ddmanager.drop(this,e),this.options.revert){var s=this,n=this.placeholder.offset(),a=this.options.axis,o={};a&&"x"!==a||(o.left=n.left-this.offset.parent.left-this.margins.left+(this.offsetParent[0]===document.body?0:this.offsetParent[0].scrollLeft)),a&&"y"!==a||(o.top=n.top-this.offset.parent.top-this.margins.top+(this.offsetParent[0]===document.body?0:this.offsetParent[0].scrollTop)),this.reverting=!0,t(this.helper).animate(o,parseInt(this.options.revert,10)||500,function(){s._clear(e)})}else this._clear(e,i);return!1}},cancel:function(){if(this.dragging){this._mouseUp({target:null}),"original"===this.options.helper?this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper"):this.currentItem.show();for(var e=this.containers.length-1;e>=0;e--)this.containers[e]._trigger("deactivate",null,this._uiHash(this)),this.containers[e].containerCache.over&&(this.containers[e]._trigger("out",null,this._uiHash(this)),this.containers[e].containerCache.over=0)}return this.placeholder&&(this.placeholder[0].parentNode&&this.placeholder[0].parentNode.removeChild(this.placeholder[0]),"original"!==this.options.helper&&this.helper&&this.helper[0].parentNode&&this.helper.remove(),t.extend(this,{helper:null,dragging:!1,reverting:!1,_noFinalSort:null}),this.domPosition.prev?t(this.domPosition.prev).after(this.currentItem):t(this.domPosition.parent).prepend(this.currentItem)),this},serialize:function(e){var i=this._getItemsAsjQuery(e&&e.connected),s=[];return e=e||{},t(i).each(function(){var i=(t(e.item||this).attr(e.attribute||"id")||"").match(e.expression||/(.+)[\-=_](.+)/);i&&s.push((e.key||i[1]+"[]")+"="+(e.key&&e.expression?i[1]:i[2]))}),!s.length&&e.key&&s.push(e.key+"="),s.join("&")},toArray:function(e){var i=this._getItemsAsjQuery(e&&e.connected),s=[];return e=e||{},i.each(function(){s.push(t(e.item||this).attr(e.attribute||"id")||"")}),s},_intersectsWith:function(t){var e=this.positionAbs.left,i=e+this.helperProportions.width,s=this.positionAbs.top,n=s+this.helperProportions.height,a=t.left,o=a+t.width,r=t.top,l=r+t.height,h=this.offset.click.top,c=this.offset.click.left,u="x"===this.options.axis||s+h>r&&l>s+h,d="y"===this.options.axis||e+c>a&&o>e+c,p=u&&d;return"pointer"===this.options.tolerance||this.options.forcePointerForContainers||"pointer"!==this.options.tolerance&&this.helperProportions[this.floating?"width":"height"]>t[this.floating?"width":"height"]?p:e+this.helperProportions.width/2>a&&o>i-this.helperProportions.width/2&&s+this.helperProportions.height/2>r&&l>n-this.helperProportions.height/2},_intersectsWithPointer:function(t){var i="x"===this.options.axis||e(this.positionAbs.top+this.offset.click.top,t.top,t.height),s="y"===this.options.axis||e(this.positionAbs.left+this.offset.click.left,t.left,t.width),n=i&&s,a=this._getDragVerticalDirection(),o=this._getDragHorizontalDirection();
    return n?this.floating?o&&"right"===o||"down"===a?2:1:a&&("down"===a?2:1):!1},_intersectsWithSides:function(t){var i=e(this.positionAbs.top+this.offset.click.top,t.top+t.height/2,t.height),s=e(this.positionAbs.left+this.offset.click.left,t.left+t.width/2,t.width),n=this._getDragVerticalDirection(),a=this._getDragHorizontalDirection();return this.floating&&a?"right"===a&&s||"left"===a&&!s:n&&("down"===n&&i||"up"===n&&!i)},_getDragVerticalDirection:function(){var t=this.positionAbs.top-this.lastPositionAbs.top;return 0!==t&&(t>0?"down":"up")},_getDragHorizontalDirection:function(){var t=this.positionAbs.left-this.lastPositionAbs.left;return 0!==t&&(t>0?"right":"left")},refresh:function(t){return this._refreshItems(t),this.refreshPositions(),this},_connectWith:function(){var t=this.options;return t.connectWith.constructor===String?[t.connectWith]:t.connectWith},_getItemsAsjQuery:function(e){var i,s,n,a,o=[],r=[],l=this._connectWith();if(l&&e)for(i=l.length-1;i>=0;i--)for(n=t(l[i]),s=n.length-1;s>=0;s--)a=t.data(n[s],this.widgetFullName),a&&a!==this&&!a.options.disabled&&r.push([t.isFunction(a.options.items)?a.options.items.call(a.element):t(a.options.items,a.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"),a]);for(r.push([t.isFunction(this.options.items)?this.options.items.call(this.element,null,{options:this.options,item:this.currentItem}):t(this.options.items,this.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"),this]),i=r.length-1;i>=0;i--)r[i][0].each(function(){o.push(this)});return t(o)},_removeCurrentsFromItems:function(){var e=this.currentItem.find(":data("+this.widgetName+"-item)");this.items=t.grep(this.items,function(t){for(var i=0;e.length>i;i++)if(e[i]===t.item[0])return!1;return!0})},_refreshItems:function(e){this.items=[],this.containers=[this];var i,s,n,a,o,r,l,h,c=this.items,u=[[t.isFunction(this.options.items)?this.options.items.call(this.element[0],e,{item:this.currentItem}):t(this.options.items,this.element),this]],d=this._connectWith();if(d&&this.ready)for(i=d.length-1;i>=0;i--)for(n=t(d[i]),s=n.length-1;s>=0;s--)a=t.data(n[s],this.widgetFullName),a&&a!==this&&!a.options.disabled&&(u.push([t.isFunction(a.options.items)?a.options.items.call(a.element[0],e,{item:this.currentItem}):t(a.options.items,a.element),a]),this.containers.push(a));for(i=u.length-1;i>=0;i--)for(o=u[i][1],r=u[i][0],s=0,h=r.length;h>s;s++)l=t(r[s]),l.data(this.widgetName+"-item",o),c.push({item:l,instance:o,width:0,height:0,left:0,top:0})},refreshPositions:function(e){this.offsetParent&&this.helper&&(this.offset.parent=this._getParentOffset());var i,s,n,a;for(i=this.items.length-1;i>=0;i--)s=this.items[i],s.instance!==this.currentContainer&&this.currentContainer&&s.item[0]!==this.currentItem[0]||(n=this.options.toleranceElement?t(this.options.toleranceElement,s.item):s.item,e||(s.width=n.outerWidth(),s.height=n.outerHeight()),a=n.offset(),s.left=a.left,s.top=a.top);if(this.options.custom&&this.options.custom.refreshContainers)this.options.custom.refreshContainers.call(this);else for(i=this.containers.length-1;i>=0;i--)a=this.containers[i].element.offset(),this.containers[i].containerCache.left=a.left,this.containers[i].containerCache.top=a.top,this.containers[i].containerCache.width=this.containers[i].element.outerWidth(),this.containers[i].containerCache.height=this.containers[i].element.outerHeight();return this},_createPlaceholder:function(e){e=e||this;var i,s=e.options;s.placeholder&&s.placeholder.constructor!==String||(i=s.placeholder,s.placeholder={element:function(){var s=e.currentItem[0].nodeName.toLowerCase(),n=t("<"+s+">",e.document[0]).addClass(i||e.currentItem[0].className+" ui-sortable-placeholder").removeClass("ui-sortable-helper");return"tr"===s?e.currentItem.children().each(function(){t("<td>&#160;</td>",e.document[0]).attr("colspan",t(this).attr("colspan")||1).appendTo(n)}):"img"===s&&n.attr("src",e.currentItem.attr("src")),i||n.css("visibility","hidden"),n},update:function(t,n){(!i||s.forcePlaceholderSize)&&(n.height()||n.height(e.currentItem.innerHeight()-parseInt(e.currentItem.css("paddingTop")||0,10)-parseInt(e.currentItem.css("paddingBottom")||0,10)),n.width()||n.width(e.currentItem.innerWidth()-parseInt(e.currentItem.css("paddingLeft")||0,10)-parseInt(e.currentItem.css("paddingRight")||0,10)))}}),e.placeholder=t(s.placeholder.element.call(e.element,e.currentItem)),e.currentItem.after(e.placeholder),s.placeholder.update(e,e.placeholder)},_contactContainers:function(s){var n,a,o,r,l,h,c,u,d,p,f=null,g=null;for(n=this.containers.length-1;n>=0;n--)if(!t.contains(this.currentItem[0],this.containers[n].element[0]))if(this._intersectsWith(this.containers[n].containerCache)){if(f&&t.contains(this.containers[n].element[0],f.element[0]))continue;f=this.containers[n],g=n}else this.containers[n].containerCache.over&&(this.containers[n]._trigger("out",s,this._uiHash(this)),this.containers[n].containerCache.over=0);if(f)if(1===this.containers.length)this.containers[g].containerCache.over||(this.containers[g]._trigger("over",s,this._uiHash(this)),this.containers[g].containerCache.over=1);else{for(o=1e4,r=null,p=f.floating||i(this.currentItem),l=p?"left":"top",h=p?"width":"height",c=this.positionAbs[l]+this.offset.click[l],a=this.items.length-1;a>=0;a--)t.contains(this.containers[g].element[0],this.items[a].item[0])&&this.items[a].item[0]!==this.currentItem[0]&&(!p||e(this.positionAbs.top+this.offset.click.top,this.items[a].top,this.items[a].height))&&(u=this.items[a].item.offset()[l],d=!1,Math.abs(u-c)>Math.abs(u+this.items[a][h]-c)&&(d=!0,u+=this.items[a][h]),o>Math.abs(u-c)&&(o=Math.abs(u-c),r=this.items[a],this.direction=d?"up":"down"));if(!r&&!this.options.dropOnEmpty)return;if(this.currentContainer===this.containers[g])return;r?this._rearrange(s,r,null,!0):this._rearrange(s,null,this.containers[g].element,!0),this._trigger("change",s,this._uiHash()),this.containers[g]._trigger("change",s,this._uiHash(this)),this.currentContainer=this.containers[g],this.options.placeholder.update(this.currentContainer,this.placeholder),this.containers[g]._trigger("over",s,this._uiHash(this)),this.containers[g].containerCache.over=1}},_createHelper:function(e){var i=this.options,s=t.isFunction(i.helper)?t(i.helper.apply(this.element[0],[e,this.currentItem])):"clone"===i.helper?this.currentItem.clone():this.currentItem;return s.parents("body").length||t("parent"!==i.appendTo?i.appendTo:this.currentItem[0].parentNode)[0].appendChild(s[0]),s[0]===this.currentItem[0]&&(this._storedCSS={width:this.currentItem[0].style.width,height:this.currentItem[0].style.height,position:this.currentItem.css("position"),top:this.currentItem.css("top"),left:this.currentItem.css("left")}),(!s[0].style.width||i.forceHelperSize)&&s.width(this.currentItem.width()),(!s[0].style.height||i.forceHelperSize)&&s.height(this.currentItem.height()),s},_adjustOffsetFromHelper:function(e){"string"==typeof e&&(e=e.split(" ")),t.isArray(e)&&(e={left:+e[0],top:+e[1]||0}),"left"in e&&(this.offset.click.left=e.left+this.margins.left),"right"in e&&(this.offset.click.left=this.helperProportions.width-e.right+this.margins.left),"top"in e&&(this.offset.click.top=e.top+this.margins.top),"bottom"in e&&(this.offset.click.top=this.helperProportions.height-e.bottom+this.margins.top)},_getParentOffset:function(){this.offsetParent=this.helper.offsetParent();var e=this.offsetParent.offset();return"absolute"===this.cssPosition&&this.scrollParent[0]!==document&&t.contains(this.scrollParent[0],this.offsetParent[0])&&(e.left+=this.scrollParent.scrollLeft(),e.top+=this.scrollParent.scrollTop()),(this.offsetParent[0]===document.body||this.offsetParent[0].tagName&&"html"===this.offsetParent[0].tagName.toLowerCase()&&t.ui.ie)&&(e={top:0,left:0}),{top:e.top+(parseInt(this.offsetParent.css("borderTopWidth"),10)||0),left:e.left+(parseInt(this.offsetParent.css("borderLeftWidth"),10)||0)}},_getRelativeOffset:function(){if("relative"===this.cssPosition){var t=this.currentItem.position();return{top:t.top-(parseInt(this.helper.css("top"),10)||0)+this.scrollParent.scrollTop(),left:t.left-(parseInt(this.helper.css("left"),10)||0)+this.scrollParent.scrollLeft()}}return{top:0,left:0}},_cacheMargins:function(){this.margins={left:parseInt(this.currentItem.css("marginLeft"),10)||0,top:parseInt(this.currentItem.css("marginTop"),10)||0}},_cacheHelperProportions:function(){this.helperProportions={width:this.helper.outerWidth(),height:this.helper.outerHeight()}},_setContainment:function(){var e,i,s,n=this.options;"parent"===n.containment&&(n.containment=this.helper[0].parentNode),("document"===n.containment||"window"===n.containment)&&(this.containment=[0-this.offset.relative.left-this.offset.parent.left,0-this.offset.relative.top-this.offset.parent.top,t("document"===n.containment?document:window).width()-this.helperProportions.width-this.margins.left,(t("document"===n.containment?document:window).height()||document.body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top]),/^(document|window|parent)$/.test(n.containment)||(e=t(n.containment)[0],i=t(n.containment).offset(),s="hidden"!==t(e).css("overflow"),this.containment=[i.left+(parseInt(t(e).css("borderLeftWidth"),10)||0)+(parseInt(t(e).css("paddingLeft"),10)||0)-this.margins.left,i.top+(parseInt(t(e).css("borderTopWidth"),10)||0)+(parseInt(t(e).css("paddingTop"),10)||0)-this.margins.top,i.left+(s?Math.max(e.scrollWidth,e.offsetWidth):e.offsetWidth)-(parseInt(t(e).css("borderLeftWidth"),10)||0)-(parseInt(t(e).css("paddingRight"),10)||0)-this.helperProportions.width-this.margins.left,i.top+(s?Math.max(e.scrollHeight,e.offsetHeight):e.offsetHeight)-(parseInt(t(e).css("borderTopWidth"),10)||0)-(parseInt(t(e).css("paddingBottom"),10)||0)-this.helperProportions.height-this.margins.top])},_convertPositionTo:function(e,i){i||(i=this.position);var s="absolute"===e?1:-1,n="absolute"!==this.cssPosition||this.scrollParent[0]!==document&&t.contains(this.scrollParent[0],this.offsetParent[0])?this.scrollParent:this.offsetParent,a=/(html|body)/i.test(n[0].tagName);return{top:i.top+this.offset.relative.top*s+this.offset.parent.top*s-("fixed"===this.cssPosition?-this.scrollParent.scrollTop():a?0:n.scrollTop())*s,left:i.left+this.offset.relative.left*s+this.offset.parent.left*s-("fixed"===this.cssPosition?-this.scrollParent.scrollLeft():a?0:n.scrollLeft())*s}},_generatePosition:function(e){var i,s,n=this.options,a=e.pageX,o=e.pageY,r="absolute"!==this.cssPosition||this.scrollParent[0]!==document&&t.contains(this.scrollParent[0],this.offsetParent[0])?this.scrollParent:this.offsetParent,l=/(html|body)/i.test(r[0].tagName);return"relative"!==this.cssPosition||this.scrollParent[0]!==document&&this.scrollParent[0]!==this.offsetParent[0]||(this.offset.relative=this._getRelativeOffset()),this.originalPosition&&(this.containment&&(e.pageX-this.offset.click.left<this.containment[0]&&(a=this.containment[0]+this.offset.click.left),e.pageY-this.offset.click.top<this.containment[1]&&(o=this.containment[1]+this.offset.click.top),e.pageX-this.offset.click.left>this.containment[2]&&(a=this.containment[2]+this.offset.click.left),e.pageY-this.offset.click.top>this.containment[3]&&(o=this.containment[3]+this.offset.click.top)),n.grid&&(i=this.originalPageY+Math.round((o-this.originalPageY)/n.grid[1])*n.grid[1],o=this.containment?i-this.offset.click.top>=this.containment[1]&&i-this.offset.click.top<=this.containment[3]?i:i-this.offset.click.top>=this.containment[1]?i-n.grid[1]:i+n.grid[1]:i,s=this.originalPageX+Math.round((a-this.originalPageX)/n.grid[0])*n.grid[0],a=this.containment?s-this.offset.click.left>=this.containment[0]&&s-this.offset.click.left<=this.containment[2]?s:s-this.offset.click.left>=this.containment[0]?s-n.grid[0]:s+n.grid[0]:s)),{top:o-this.offset.click.top-this.offset.relative.top-this.offset.parent.top+("fixed"===this.cssPosition?-this.scrollParent.scrollTop():l?0:r.scrollTop()),left:a-this.offset.click.left-this.offset.relative.left-this.offset.parent.left+("fixed"===this.cssPosition?-this.scrollParent.scrollLeft():l?0:r.scrollLeft())}},_rearrange:function(t,e,i,s){i?i[0].appendChild(this.placeholder[0]):e.item[0].parentNode.insertBefore(this.placeholder[0],"down"===this.direction?e.item[0]:e.item[0].nextSibling),this.counter=this.counter?++this.counter:1;var n=this.counter;this._delay(function(){n===this.counter&&this.refreshPositions(!s)})},_clear:function(t,e){this.reverting=!1;var i,s=[];if(!this._noFinalSort&&this.currentItem.parent().length&&this.placeholder.before(this.currentItem),this._noFinalSort=null,this.helper[0]===this.currentItem[0]){for(i in this._storedCSS)("auto"===this._storedCSS[i]||"static"===this._storedCSS[i])&&(this._storedCSS[i]="");this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper")}else this.currentItem.show();for(this.fromOutside&&!e&&s.push(function(t){this._trigger("receive",t,this._uiHash(this.fromOutside))}),!this.fromOutside&&this.domPosition.prev===this.currentItem.prev().not(".ui-sortable-helper")[0]&&this.domPosition.parent===this.currentItem.parent()[0]||e||s.push(function(t){this._trigger("update",t,this._uiHash())}),this!==this.currentContainer&&(e||(s.push(function(t){this._trigger("remove",t,this._uiHash())}),s.push(function(t){return function(e){t._trigger("receive",e,this._uiHash(this))}}.call(this,this.currentContainer)),s.push(function(t){return function(e){t._trigger("update",e,this._uiHash(this))}}.call(this,this.currentContainer)))),i=this.containers.length-1;i>=0;i--)e||s.push(function(t){return function(e){t._trigger("deactivate",e,this._uiHash(this))}}.call(this,this.containers[i])),this.containers[i].containerCache.over&&(s.push(function(t){return function(e){t._trigger("out",e,this._uiHash(this))}}.call(this,this.containers[i])),this.containers[i].containerCache.over=0);if(this.storedCursor&&(this.document.find("body").css("cursor",this.storedCursor),this.storedStylesheet.remove()),this._storedOpacity&&this.helper.css("opacity",this._storedOpacity),this._storedZIndex&&this.helper.css("zIndex","auto"===this._storedZIndex?"":this._storedZIndex),this.dragging=!1,this.cancelHelperRemoval){if(!e){for(this._trigger("beforeStop",t,this._uiHash()),i=0;s.length>i;i++)s[i].call(this,t);this._trigger("stop",t,this._uiHash())}return this.fromOutside=!1,!1}if(e||this._trigger("beforeStop",t,this._uiHash()),this.placeholder[0].parentNode.removeChild(this.placeholder[0]),this.helper[0]!==this.currentItem[0]&&this.helper.remove(),this.helper=null,!e){for(i=0;s.length>i;i++)s[i].call(this,t);this._trigger("stop",t,this._uiHash())}return this.fromOutside=!1,!0},_trigger:function(){t.Widget.prototype._trigger.apply(this,arguments)===!1&&this.cancel()},_uiHash:function(e){var i=e||this;return{helper:i.helper,placeholder:i.placeholder||t([]),position:i.position,originalPosition:i.originalPosition,offset:i.positionAbs,item:i.currentItem,sender:e?e.element:null}}})}
(jQuery),function(t){var e=0,i={},s={};i.height=i.paddingTop=i.paddingBottom=i.borderTopWidth=i.borderBottomWidth="hide",s.height=s.paddingTop=s.paddingBottom=s.borderTopWidth=s.borderBottomWidth="show",t.widget("ui.accordion",{version:"1.10.3",options:{active:0,animate:{},collapsible:!1,event:"click",header:"> li > :first-child,> :not(li):even",heightStyle:"auto",icons:{activeHeader:"ui-icon-triangle-1-s",header:"ui-icon-triangle-1-e"},activate:null,beforeActivate:null},_create:function(){var e=this.options;this.prevShow=this.prevHide=t(),this.element.addClass("ui-accordion ui-widget ui-helper-reset").attr("role","tablist"),e.collapsible||e.active!==!1&&null!=e.active||(e.active=0),this._processPanels(),0>e.active&&(e.active+=this.headers.length),this._refresh()},_getCreateEventData:function(){return{header:this.active,panel:this.active.length?this.active.next():t(),content:this.active.length?this.active.next():t()}},_createIcons:function(){var e=this.options.icons;e&&(t("<span>").addClass("ui-accordion-header-icon ui-icon "+e.header).prependTo(this.headers),this.active.children(".ui-accordion-header-icon").removeClass(e.header).addClass(e.activeHeader),this.headers.addClass("ui-accordion-icons"))},_destroyIcons:function(){this.headers.removeClass("ui-accordion-icons").children(".ui-accordion-header-icon").remove()},_destroy:function(){var t;this.element.removeClass("ui-accordion ui-widget ui-helper-reset").removeAttr("role"),this.headers.removeClass("ui-accordion-header ui-accordion-header-active ui-helper-reset ui-state-default ui-corner-all ui-state-active ui-state-disabled ui-corner-top").removeAttr("role").removeAttr("aria-selected").removeAttr("aria-controls").removeAttr("tabIndex").each(function(){/^ui-accordion/.test(this.id)&&this.removeAttribute("id")}),this._destroyIcons(),t=this.headers.next().css("display","").removeAttr("role").removeAttr("aria-expanded").removeAttr("aria-hidden").removeAttr("aria-labelledby").removeClass("ui-helper-reset ui-widget-content ui-corner-bottom ui-accordion-content ui-accordion-content-active ui-state-disabled").each(function(){/^ui-accordion/.test(this.id)&&this.removeAttribute("id")}),"content"!==this.options.heightStyle&&t.css("height","")},_setOption:function(t,e){return"active"===t?(this._activate(e),void 0):("event"===t&&(this.options.event&&this._off(this.headers,this.options.event),this._setupEvents(e)),this._super(t,e),"collapsible"!==t||e||this.options.active!==!1||this._activate(0),"icons"===t&&(this._destroyIcons(),e&&this._createIcons()),"disabled"===t&&this.headers.add(this.headers.next()).toggleClass("ui-state-disabled",!!e),void 0)},_keydown:function(e){if(!e.altKey&&!e.ctrlKey){var i=t.ui.keyCode,s=this.headers.length,n=this.headers.index(e.target),a=!1;switch(e.keyCode){case i.RIGHT:case i.DOWN:a=this.headers[(n+1)%s];break;case i.LEFT:case i.UP:a=this.headers[(n-1+s)%s];break;case i.SPACE:case i.ENTER:this._eventHandler(e);break;case i.HOME:a=this.headers[0];break;case i.END:a=this.headers[s-1]}a&&(t(e.target).attr("tabIndex",-1),t(a).attr("tabIndex",0),a.focus(),e.preventDefault())}},_panelKeyDown:function(e){e.keyCode===t.ui.keyCode.UP&&e.ctrlKey&&t(e.currentTarget).prev().focus()},refresh:function(){var e=this.options;this._processPanels(),e.active===!1&&e.collapsible===!0||!this.headers.length?(e.active=!1,this.active=t()):e.active===!1?this._activate(0):this.active.length&&!t.contains(this.element[0],this.active[0])?this.headers.length===this.headers.find(".ui-state-disabled").length?(e.active=!1,this.active=t()):this._activate(Math.max(0,e.active-1)):e.active=this.headers.index(this.active),this._destroyIcons(),this._refresh()},_processPanels:function(){this.headers=this.element.find(this.options.header).addClass("ui-accordion-header ui-helper-reset ui-state-default ui-corner-all"),this.headers.next().addClass("ui-accordion-content ui-helper-reset ui-widget-content ui-corner-bottom").filter(":not(.ui-accordion-content-active)").hide()},_refresh:function(){var i,s=this.options,n=s.heightStyle,a=this.element.parent(),o=this.accordionId="ui-accordion-"+(this.element.attr("id")||++e);this.active=this._findActive(s.active).addClass("ui-accordion-header-active ui-state-active ui-corner-top").removeClass("ui-corner-all"),this.active.next().addClass("ui-accordion-content-active").show(),this.headers.attr("role","tab").each(function(e){var i=t(this),s=i.attr("id"),n=i.next(),a=n.attr("id");s||(s=o+"-header-"+e,i.attr("id",s)),a||(a=o+"-panel-"+e,n.attr("id",a)),i.attr("aria-controls",a),n.attr("aria-labelledby",s)}).next().attr("role","tabpanel"),this.headers.not(this.active).attr({"aria-selected":"false",tabIndex:-1}).next().attr({"aria-expanded":"false","aria-hidden":"true"}).hide(),this.active.length?this.active.attr({"aria-selected":"true",tabIndex:0}).next().attr({"aria-expanded":"true","aria-hidden":"false"}):this.headers.eq(0).attr("tabIndex",0),this._createIcons(),this._setupEvents(s.event),"fill"===n?(i=a.height(),this.element.siblings(":visible").each(function(){var e=t(this),s=e.css("position");"absolute"!==s&&"fixed"!==s&&(i-=e.outerHeight(!0))}),this.headers.each(function(){i-=t(this).outerHeight(!0)}),this.headers.next().each(function(){t(this).height(Math.max(0,i-t(this).innerHeight()+t(this).height()))}).css("overflow","auto")):"auto"===n&&(i=0,this.headers.next().each(function(){i=Math.max(i,t(this).css("height","").height())}).height(i))},_activate:function(e){var i=this._findActive(e)[0];i!==this.active[0]&&(i=i||this.active[0],this._eventHandler({target:i,currentTarget:i,preventDefault:t.noop}))},_findActive:function(e){return"number"==typeof e?this.headers.eq(e):t()},_setupEvents:function(e){var i={keydown:"_keydown"};e&&t.each(e.split(" "),function(t,e){i[e]="_eventHandler"}),this._off(this.headers.add(this.headers.next())),this._on(this.headers,i),this._on(this.headers.next(),{keydown:"_panelKeyDown"}),this._hoverable(this.headers),this._focusable(this.headers)},_eventHandler:function(e){var i=this.options,s=this.active,n=t(e.currentTarget),a=n[0]===s[0],o=a&&i.collapsible,r=o?t():n.next(),l=s.next(),h={oldHeader:s,oldPanel:l,newHeader:o?t():n,newPanel:r};e.preventDefault(),a&&!i.collapsible||this._trigger("beforeActivate",e,h)===!1||(i.active=o?!1:this.headers.index(n),this.active=a?t():n,this._toggle(h),s.removeClass("ui-accordion-header-active ui-state-active"),i.icons&&s.children(".ui-accordion-header-icon").removeClass(i.icons.activeHeader).addClass(i.icons.header),a||(n.removeClass("ui-corner-all").addClass("ui-accordion-header-active ui-state-active ui-corner-top"),i.icons&&n.children(".ui-accordion-header-icon").removeClass(i.icons.header).addClass(i.icons.activeHeader),n.next().addClass("ui-accordion-content-active")))},_toggle:function(e){var i=e.newPanel,s=this.prevShow.length?this.prevShow:e.oldPanel;this.prevShow.add(this.prevHide).stop(!0,!0),this.prevShow=i,this.prevHide=s,this.options.animate?this._animate(i,s,e):(s.hide(),i.show(),this._toggleComplete(e)),s.attr({"aria-expanded":"false","aria-hidden":"true"}),s.prev().attr("aria-selected","false"),i.length&&s.length?s.prev().attr("tabIndex",-1):i.length&&this.headers.filter(function(){return 0===t(this).attr("tabIndex")}).attr("tabIndex",-1),i.attr({"aria-expanded":"true","aria-hidden":"false"}).prev().attr({"aria-selected":"true",tabIndex:0})},_animate:function(t,e,n){var a,o,r,l=this,h=0,c=t.length&&(!e.length||t.index()<e.index()),u=this.options.animate||{},d=c&&u.down||u,p=function(){l._toggleComplete(n)};return"number"==typeof d&&(r=d),"string"==typeof d&&(o=d),o=o||d.easing||u.easing,r=r||d.duration||u.duration,e.length?t.length?(a=t.show().outerHeight(),e.animate(i,{duration:r,easing:o,
    step:function(t,e){e.now=Math.round(t)}})
    ,t.hide().animate(s,{duration:r,easing:o,complete:p,
    step:function(t,i){i.now=Math.round(t),"height"!==i.prop?h+=i.now:"content"!==l.options.heightStyle&&(i.now=Math.round(a-e.outerHeight()-h),h=0)}}),void 0):e.animate(i,r,o,p):t.animate(s,r,o,p)},_toggleComplete:function(t){var e=t.oldPanel;e.removeClass("ui-accordion-content-active").prev().removeClass("ui-corner-top").addClass("ui-corner-all"),e.length&&(e.parent()[0].className=e.parent()[0].className),this._trigger("activate",null,t)}})}
(jQuery),function(t){var e=0;t.widget("ui.autocomplete",{version:"1.10.3",defaultElement:"<input>",options:{appendTo:null,autoFocus:!1,delay:300,minLength:1,position:{my:"left top",at:"left bottom",collision:"none"},source:null,change:null,close:null,focus:null,open:null,response:null,search:null,select:null},pending:0,_create:function(){var e,i,s,n=this.element[0].nodeName.toLowerCase(),a="textarea"===n,o="input"===n;this.isMultiLine=a?!0:o?!1:this.element.prop("isContentEditable"),this.valueMethod=this.element[a||o?"val":"text"],this.isNewMenu=!0,this.element.addClass("ui-autocomplete-input").attr("autocomplete","off"),this._on(this.element,{keydown:function(n){if(this.element.prop("readOnly"))return e=!0,s=!0,i=!0,void 0;e=!1,s=!1,i=!1;var a=t.ui.keyCode;switch(n.keyCode){case a.PAGE_UP:e=!0,this._move("previousPage",n);break;case a.PAGE_DOWN:e=!0,this._move("nextPage",n);break;case a.UP:e=!0,this._keyEvent("previous",n);break;case a.DOWN:e=!0,this._keyEvent("next",n);break;case a.ENTER:case a.NUMPAD_ENTER:this.menu.active&&(e=!0,n.preventDefault(),this.menu.select(n));break;case a.TAB:this.menu.active&&this.menu.select(n);break;case a.ESCAPE:this.menu.element.is(":visible")&&(this._value(this.term),this.close(n),n.preventDefault());break;default:i=!0,this._searchTimeout(n)}},keypress:function(s){if(e)return e=!1,(!this.isMultiLine||this.menu.element.is(":visible"))&&s.preventDefault(),void 0;if(!i){var n=t.ui.keyCode;switch(s.keyCode){case n.PAGE_UP:this._move("previousPage",s);break;case n.PAGE_DOWN:this._move("nextPage",s);break;case n.UP:this._keyEvent("previous",s);break;case n.DOWN:this._keyEvent("next",s)}}},input:function(t){return s?(s=!1,t.preventDefault(),void 0):(this._searchTimeout(t),void 0)},focus:function(){this.selectedItem=null,this.previous=this._value()},blur:function(t){return this.cancelBlur?(delete this.cancelBlur,void 0):(clearTimeout(this.searching),this.close(t),this._change(t),void 0)}}),this._initSource(),this.menu=t("<ul>").addClass("ui-autocomplete ui-front").appendTo(this._appendTo()).menu({role:null}).hide().data("ui-menu"),this._on(this.menu.element,{mousedown:function(e){e.preventDefault(),this.cancelBlur=!0,this._delay(function(){delete this.cancelBlur});var i=this.menu.element[0];t(e.target).closest(".ui-menu-item").length||this._delay(function(){var e=this;this.document.one("mousedown",function(s){s.target===e.element[0]||s.target===i||t.contains(i,s.target)||e.close()})})},menufocus:function(e,i){if(this.isNewMenu&&(this.isNewMenu=!1,e.originalEvent&&/^mouse/.test(e.originalEvent.type)))return this.menu.blur(),this.document.one("mousemove",function(){t(e.target).trigger(e.originalEvent)}),void 0;var s=i.item.data("ui-autocomplete-item");!1!==this._trigger("focus",e,{item:s})?e.originalEvent&&/^key/.test(e.originalEvent.type)&&this._value(s.value):this.liveRegion.text(s.value)},menuselect:function(t,e){var i=e.item.data("ui-autocomplete-item"),s=this.previous;this.element[0]!==this.document[0].activeElement&&(this.element.focus(),this.previous=s,this._delay(function(){this.previous=s,this.selectedItem=i})),!1!==this._trigger("select",t,{item:i})&&this._value(i.value),this.term=this._value(),this.close(t),this.selectedItem=i}}),this.liveRegion=t("<span>",{role:"status","aria-live":"polite"}).addClass("ui-helper-hidden-accessible").insertBefore(this.element),this._on(this.window,{beforeunload:function(){this.element.removeAttr("autocomplete")}})},_destroy:function(){clearTimeout(this.searching),this.element.removeClass("ui-autocomplete-input").removeAttr("autocomplete"),this.menu.element.remove(),this.liveRegion.remove()},_setOption:function(t,e){this._super(t,e),"source"===t&&this._initSource(),"appendTo"===t&&this.menu.element.appendTo(this._appendTo()),"disabled"===t&&e&&this.xhr&&this.xhr.abort()},_appendTo:function(){var e=this.options.appendTo;return e&&(e=e.jquery||e.nodeType?t(e):this.document.find(e).eq(0)),e||(e=this.element.closest(".ui-front")),e.length||(e=this.document[0].body),e},_initSource:function(){var e,i,s=this;t.isArray(this.options.source)?(e=this.options.source,this.source=function(i,s){s(t.ui.autocomplete.filter(e,i.term))}):"string"==typeof this.options.source?(i=this.options.source,this.source=function(e,n){s.xhr&&s.xhr.abort(),s.xhr=t.ajax({url:i,data:e,dataType:"json",success:function(t){n(t)},error:function(){n([])}})}):this.source=this.options.source},_searchTimeout:function(t){clearTimeout(this.searching),this.searching=this._delay(function(){this.term!==this._value()&&(this.selectedItem=null,this.search(null,t))},this.options.delay)},search:function(t,e){return t=null!=t?t:this._value(),this.term=this._value(),t.length<this.options.minLength?this.close(e):this._trigger("search",e)!==!1?this._search(t):void 0},_search:function(t){this.pending++,this.element.addClass("ui-autocomplete-loading"),this.cancelSearch=!1,this.source({term:t},this._response())},_response:function(){var t=this,i=++e;return function(s){i===e&&t.__response(s),t.pending--,t.pending||t.element.removeClass("ui-autocomplete-loading")}},__response:function(t){t&&(t=this._normalize(t)),this._trigger("response",null,{content:t}),!this.options.disabled&&t&&t.length&&!this.cancelSearch?(this._suggest(t),this._trigger("open")):this._close()},close:function(t){this.cancelSearch=!0,this._close(t)},_close:function(t){this.menu.element.is(":visible")&&(this.menu.element.hide(),this.menu.blur(),this.isNewMenu=!0,this._trigger("close",t))},_change:function(t){this.previous!==this._value()&&this._trigger("change",t,{item:this.selectedItem})},_normalize:function(e){return e.length&&e[0].label&&e[0].value?e:t.map(e,function(e){return"string"==typeof e?{label:e,value:e}:t.extend({label:e.label||e.value,value:e.value||e.label},e)})},_suggest:function(e){var i=this.menu.element.empty();this._renderMenu(i,e),this.isNewMenu=!0,this.menu.refresh(),i.show(),this._resizeMenu(),i.position(t.extend({of:this.element},this.options.position)),this.options.autoFocus&&this.menu.next()},_resizeMenu:function(){var t=this.menu.element;t.outerWidth(Math.max(t.width("").outerWidth()+1,this.element.outerWidth()))},_renderMenu:function(e,i){var s=this;t.each(i,function(t,i){s._renderItemData(e,i)})},_renderItemData:function(t,e){return this._renderItem(t,e).data("ui-autocomplete-item",e)},_renderItem:function(e,i){return t("<li>").append(t("<a>").text(i.label)).appendTo(e)},_move:function(t,e){return this.menu.element.is(":visible")?this.menu.isFirstItem()&&/^previous/.test(t)||this.menu.isLastItem()&&/^next/.test(t)?(this._value(this.term),this.menu.blur(),void 0):(this.menu[t](e),void 0):(this.search(null,e),void 0)},widget:function(){return this.menu.element},_value:function(){return this.valueMethod.apply(this.element,arguments)},_keyEvent:function(t,e){(!this.isMultiLine||this.menu.element.is(":visible"))&&(this._move(t,e),e.preventDefault())}}),t.extend(t.ui.autocomplete,{escapeRegex:function(t){return t.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&")},filter:function(e,i){var s=RegExp(t.ui.autocomplete.escapeRegex(i),"i");return t.grep(e,function(t){return s.test(t.label||t.value||t)})}}),t.widget("ui.autocomplete",t.ui.autocomplete,{options:{messages:{noResults:"No search results.",results:function(t){return t+(t>1?" results are":" result is")+" available, use up and down arrow keys to navigate."}}},__response:function(t){var e;this._superApply(arguments),this.options.disabled||this.cancelSearch||(e=t&&t.length?this.options.messages.results(t.length):this.options.messages.noResults,this.liveRegion.text(e))}})}
(jQuery),function(t){var e,i,s,n,a="ui-button ui-widget ui-state-default ui-corner-all",o="ui-state-hover ui-state-active ",r="ui-button-icons-only ui-button-icon-only ui-button-text-icons ui-button-text-icon-primary ui-button-text-icon-secondary ui-button-text-only",l=function(){var e=t(this);setTimeout(function(){e.find(":ui-button").button("refresh")},1)},h=function(e){var i=e.name,s=e.form,n=t([]);return i&&(i=i.replace(/'/g,"\\'"),n=s?t(s).find("[name='"+i+"']"):t("[name='"+i+"']",e.ownerDocument).filter(function(){return!this.form})),n};t.widget("ui.button",{version:"1.10.3",defaultElement:"<button>",options:{disabled:null,text:!0,label:null,icons:{primary:null,secondary:null}},_create:function(){this.element.closest("form").unbind("reset"+this.eventNamespace).bind("reset"+this.eventNamespace,l),"boolean"!=typeof this.options.disabled?this.options.disabled=!!this.element.prop("disabled"):this.element.prop("disabled",this.options.disabled),this._determineButtonType(),this.hasTitle=!!this.buttonElement.attr("title");var o=this,r=this.options,c="checkbox"===this.type||"radio"===this.type,u=c?"":"ui-state-active",d="ui-state-focus";null===r.label&&(r.label="input"===this.type?this.buttonElement.val():this.buttonElement.html()),this._hoverable(this.buttonElement),this.buttonElement.addClass(a).attr("role","button").bind("mouseenter"+this.eventNamespace,function(){r.disabled||this===e&&t(this).addClass("ui-state-active")}).bind("mouseleave"+this.eventNamespace,function(){r.disabled||t(this).removeClass(u)}).bind("click"+this.eventNamespace,function(t){r.disabled&&(t.preventDefault(),t.stopImmediatePropagation())}),this.element.bind("focus"+this.eventNamespace,function(){o.buttonElement.addClass(d)}).bind("blur"+this.eventNamespace,function(){o.buttonElement.removeClass(d)}),c&&(this.element.bind("change"+this.eventNamespace,function(){n||o.refresh()}),this.buttonElement.bind("mousedown"+this.eventNamespace,function(t){r.disabled||(n=!1,i=t.pageX,s=t.pageY)}).bind("mouseup"+this.eventNamespace,function(t){r.disabled||(i!==t.pageX||s!==t.pageY)&&(n=!0)
})),"checkbox"===this.type?this.buttonElement.bind("click"+this.eventNamespace,
    function(){return r.disabled||n?!1:void 0}):"radio"===this.type?this.buttonElement.bind("click"+this.eventNamespace,function(){if(r.disabled||n)return!1;t(this).addClass("ui-state-active"),o.buttonElement.attr("aria-pressed","true");var e=o.element[0];h(e).not(e).map(function(){return t(this).button("widget")[0]}).removeClass("ui-state-active").attr("aria-pressed","false")}):(this.buttonElement.bind("mousedown"+this.eventNamespace,function(){return r.disabled?!1:(t(this).addClass("ui-state-active"),e=this,o.document.one("mouseup",function(){e=null}),void 0)}).bind("mouseup"+this.eventNamespace,function(){return r.disabled?!1:(t(this).removeClass("ui-state-active"),void 0)}).bind("keydown"+this.eventNamespace,function(e){return r.disabled?!1:((e.keyCode===t.ui.keyCode.SPACE||e.keyCode===t.ui.keyCode.ENTER)&&t(this).addClass("ui-state-active"),void 0)}).bind("keyup"+this.eventNamespace+" blur"+this.eventNamespace,function(){t(this).removeClass("ui-state-active")}),this.buttonElement.is("a")&&this.buttonElement.keyup(function(e){e.keyCode===t.ui.keyCode.SPACE&&t(this).click()})),this._setOption("disabled",r.disabled),this._resetButton()},_determineButtonType:function(){var t,e,i;this.type=this.element.is("[type=checkbox]")?"checkbox":this.element.is("[type=radio]")?"radio":this.element.is("input")?"input":"button","checkbox"===this.type||"radio"===this.type?(t=this.element.parents().last(),e="label[for='"+this.element.attr("id")+"']",this.buttonElement=t.find(e),this.buttonElement.length||(t=t.length?t.siblings():this.element.siblings(),this.buttonElement=t.filter(e),this.buttonElement.length||(this.buttonElement=t.find(e))),this.element.addClass("ui-helper-hidden-accessible"),i=this.element.is(":checked"),i&&this.buttonElement.addClass("ui-state-active"),this.buttonElement.prop("aria-pressed",i)):this.buttonElement=this.element},widget:function(){return this.buttonElement},_destroy:function(){this.element.removeClass("ui-helper-hidden-accessible"),this.buttonElement.removeClass(a+" "+o+" "+r).removeAttr("role").removeAttr("aria-pressed").html(this.buttonElement.find(".ui-button-text").html()),this.hasTitle||this.buttonElement.removeAttr("title")},_setOption:function(t,e){return this._super(t,e),"disabled"===t?(e?this.element.prop("disabled",!0):this.element.prop("disabled",!1),void 0):(this._resetButton(),void 0)},refresh:function(){var e=this.element.is("input, button")?this.element.is(":disabled"):this.element.hasClass("ui-button-disabled");e!==this.options.disabled&&this._setOption("disabled",e),"radio"===this.type?h(this.element[0]).each(function(){t(this).is(":checked")?t(this).button("widget").addClass("ui-state-active").attr("aria-pressed","true"):t(this).button("widget").removeClass("ui-state-active").attr("aria-pressed","false")}):"checkbox"===this.type&&(this.element.is(":checked")?this.buttonElement.addClass("ui-state-active").attr("aria-pressed","true"):this.buttonElement.removeClass("ui-state-active").attr("aria-pressed","false"))},_resetButton:function(){if("input"===this.type)return this.options.label&&this.element.val(this.options.label),void 0;var e=this.buttonElement.removeClass(r),i=t("<span></span>",this.document[0]).addClass("ui-button-text").html(this.options.label).appendTo(e.empty()).text(),s=this.options.icons,n=s.primary&&s.secondary,a=[];s.primary||s.secondary?(this.options.text&&a.push("ui-button-text-icon"+(n?"s":s.primary?"-primary":"-secondary")),s.primary&&e.prepend("<span class='ui-button-icon-primary ui-icon "+s.primary+"'></span>"),s.secondary&&e.append("<span class='ui-button-icon-secondary ui-icon "+s.secondary+"'></span>"),this.options.text||(a.push(n?"ui-button-icons-only":"ui-button-icon-only"),this.hasTitle||e.attr("title",t.trim(i)))):a.push("ui-button-text-only"),e.addClass(a.join(" "))}}),t.widget("ui.buttonset",{version:"1.10.3",options:{items:"button, input[type=button], input[type=submit], input[type=reset], input[type=checkbox], input[type=radio], a, :data(ui-button)"},_create:function(){this.element.addClass("ui-buttonset")},_init:function(){this.refresh()},_setOption:function(t,e){"disabled"===t&&this.buttons.button("option",t,e),this._super(t,e)},refresh:function(){var e="rtl"===this.element.css("direction");this.buttons=this.element.find(this.options.items).filter(":ui-button").button("refresh").end().not(":ui-button").button().end().map(function(){return t(this).button("widget")[0]}).removeClass("ui-corner-all ui-corner-left ui-corner-right").filter(":first").addClass(e?"ui-corner-right":"ui-corner-left").end().filter(":last").addClass(e?"ui-corner-left":"ui-corner-right").end().end()},_destroy:function(){this.element.removeClass("ui-buttonset"),this.buttons.map(function(){return t(this).button("widget")[0]}).removeClass("ui-corner-left ui-corner-right").end().button("destroy")}})}
(jQuery),function(t,e){
    function i(){
        this._curInst=null,
            this._keyEvent=!1,
            this._disabledInputs=[],
            this._datepickerShowing=!1,this._inDialog=!1,
            this._mainDivId="ui-datepicker-div",
            this._inlineClass="ui-datepicker-inline",
            this._appendClass="ui-datepicker-append",
            this._triggerClass="ui-datepicker-trigger",
            this._dialogClass="ui-datepicker-dialog",
            this._disableClass="ui-datepicker-disabled",
            this._unselectableClass="ui-datepicker-unselectable",
            this._currentClass="ui-datepicker-current-day",
            this._dayOverClass="ui-datepicker-days-cell-over",
            this.regional=[],this.regional[""]={
            closeText:"Done",prevText:"Prev",nextText:"Next",
            currentText:"Today",
            monthNames:["January","February","March","April","May","June","July","August","September","October","November","December"],
            monthNamesShort:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
            dayNames:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
            dayNamesShort:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],
            dayNamesMin:["Su","Mo","Tu","We","Th","Fr","Sa"],
            weekHeader:"Wk",dateFormat:"dd/mm/yy",
            firstDay:0,isRTL:!1,showMonthAfterYear:!1,yearSuffix:""},
            this._defaults={showOn:"focus",showAnim:"fadeIn",showOptions:{},defaultDate:null,appendText:"",buttonText:"...",buttonImage:"",buttonImageOnly:!1,hideIfNoPrevNext:!1,navigationAsDateFormat:!1,gotoCurrent:!1,
            changeMonth:!1,
            changeYear:!1,yearRange:"c-10:c+10",showOtherMonths:!1,selectOtherMonths:!1,
            showWeek:!1,calculateWeek:this.iso8601Week,shortYearCutoff:"+10",
            minDate:null,maxDate:null,duration:"fast",
            beforeShowDay:null,beforeShow:null,onSelect:null,
            onChangeMonthYear:null,onClose:null,
            numberOfMonths:1,
            showCurrentAtPos:0,stepMonths:1,stepBigMonths:12,altField:"",altFormat:"",constrainInput:!0,showButtonPanel:!1,autoSize:!1,disabled:!1},
            t.extend(this._defaults,this.regional[""]),this.dpDiv=s(t("<div id='"+this._mainDivId+"' class='ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>"))
    }
    function s(e){
        var i="button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a";
        return e.delegate(i,"mouseout",function(){
            t(this).removeClass("ui-state-hover"),-1!==this.className.indexOf("ui-datepicker-prev")&&t(this).removeClass("ui-datepicker-prev-hover"),-1!==this.className.indexOf("ui-datepicker-next")&&t(this).removeClass("ui-datepicker-next-hover")
        }).delegate(i,"mouseover",function(){t.datepicker._isDisabledDatepicker(a.inline?e.parent()[0]:a.input[0])||(t(this).parents(".ui-datepicker-calendar").find("a").removeClass("ui-state-hover"),t(this).addClass("ui-state-hover"),-1!==this.className.indexOf("ui-datepicker-prev")&&t(this).addClass("ui-datepicker-prev-hover"),-1!==this.className.indexOf("ui-datepicker-next")&&t(this).addClass("ui-datepicker-next-hover"))
        })}
    function n(e,i){t.extend(e,i);for(var s in i)null==i[s]&&(e[s]=i[s]);return e}
    t.extend(t.ui,{datepicker:{version:"1.10.3"}});
    var a,o="datepicker";t.extend(i.prototype,{markerClassName:"hasDatepicker",maxRows:4,_widgetDatepicker:function(){return this.dpDiv},
        setDefaults:function(t){return n(this._defaults,t||{}),this},_attachDatepicker:function(e,i){var s,n,a;s=e.nodeName.toLowerCase(),n="div"===s||"span"===s,e.id||(this.uuid+=1,e.id="dp"+this.uuid),a=this._newInst(t(e),n),a.settings=t.extend({},i||{}),"input"===s?this._connectDatepicker(e,a):n&&this._inlineDatepicker(e,a)},_newInst:function(e,i){var n=e[0].id.replace(/([^A-Za-z0-9_\-])/g,"\\\\$1");
        return{id:n,input:e,selectedDay:0,
        selectedMonth:0,selectedYear:0,drawMonth:0,drawYear:0,inline:i,dpDiv:i?s(t("<div class='"+this._inlineClass+" ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>")):this.dpDiv}},
        _connectDatepicker:function(e,i){var s=t(e);i.append=t([]),i.trigger=t([]),
        s.hasClass(this.markerClassName)||(this._attachments(s,i),s.addClass(this.markerClassName).keydown(this._doKeyDown).keypress(this._doKeyPress).keyup(this._doKeyUp),this._autoSize(i),t.data(e,o,i),
        i.settings.disabled&&this._disableDatepicker(e))},_attachments:function(e,i){var s,n,a,o=this._get(i,"appendText"),r=this._get(i,"isRTL");i.append&&i.append.remove(),o&&(i.append=t("<span class='"+this._appendClass+"'>"+o+"</span>"),e[r?"before":"after"](i.append)),e.unbind("focus",this._showDatepicker),i.trigger&&i.trigger.remove(),s=this._get(i,"showOn"),("focus"===s||"both"===s)&&e.focus(this._showDatepicker),("button"===s||"both"===s)&&(n=this._get(i,"buttonText"),a=this._get(i,"buttonImage"),i.trigger=t(this._get(i,"buttonImageOnly")?t("<img/>").addClass(this._triggerClass).attr({src:a,alt:n,title:n}):t("<button type='button'></button>").addClass(this._triggerClass).html(a?t("<img/>").attr({src:a,alt:n,title:n}):n)),e[r?"before":"after"](i.trigger),i.trigger.click(function(){return t.datepicker._datepickerShowing&&t.datepicker._lastInput===e[0]?t.datepicker._hideDatepicker():t.datepicker._datepickerShowing&&t.datepicker._lastInput!==e[0]?(t.datepicker._hideDatepicker(),t.datepicker._showDatepicker(e[0])):t.datepicker._showDatepicker(e[0]),!1}))},_autoSize:function(t){if(this._get(t,"autoSize")&&!t.inline){var e,i,s,n,a=new Date(2009,11,20),o=this._get(t,"dateFormat");o.match(/[DM]/)&&(e=function(t){for(i=0,s=0,n=0;t.length>n;n++)t[n].length>i&&(i=t[n].length,s=n);return s}
        ,
        a.setMonth(e(this._get(t,o.match(/MM/)?"monthNames":"monthNamesShort"))),
        a.setDate(e(this._get(t,o.match(/DD/)?"dayNames":"dayNamesShort"))+20-a.getDay())),t.input.attr("size",this._formatDate(t,a).length)}},_inlineDatepicker:function(e,i){var s=t(e);s.hasClass(this.markerClassName)||(s.addClass(this.markerClassName).append(i.dpDiv),t.data(e,o,i),this._setDate(i,this._getDefaultDate(i),!0),this._updateDatepicker(i),this._updateAlternate(i),i.settings.disabled&&this._disableDatepicker(e),i.dpDiv.css("display","block"))},_dialogDatepicker:function(e,i,s,a,r){var l,h,c,u,d,p=this._dialogInst;return p||(this.uuid+=1,l="dp"+this.uuid,this._dialogInput=t("<input type='text' id='"+l+"' style='position: absolute; top: -100px; width: 0px;'/>"),this._dialogInput.keydown(this._doKeyDown),t("body").append(this._dialogInput),p=this._dialogInst=this._newInst(this._dialogInput,!1),p.settings={},t.data(this._dialogInput[0],o,p)),n(p.settings,a||{}),i=i&&i.constructor===Date?this._formatDate(p,i):i,this._dialogInput.val(i),this._pos=r?r.length?r:[r.pageX,r.pageY]:null,this._pos||(h=document.documentElement.clientWidth,c=document.documentElement.clientHeight,u=document.documentElement.scrollLeft||document.body.scrollLeft,d=document.documentElement.scrollTop||document.body.scrollTop,this._pos=[h/2-100+u,c/2-150+d]),this._dialogInput.css("left",this._pos[0]+20+"px").css("top",this._pos[1]+"px"),p.settings.onSelect=s,this._inDialog=!0,this.dpDiv.addClass(this._dialogClass),this._showDatepicker(this._dialogInput[0]),t.blockUI&&t.blockUI(this.dpDiv),t.data(this._dialogInput[0],o,p),this},_destroyDatepicker:function(e){var i,s=t(e),n=t.data(e,o);s.hasClass(this.markerClassName)&&(i=e.nodeName.toLowerCase(),t.removeData(e,o),"input"===i?(n.append.remove(),n.trigger.remove(),s.removeClass(this.markerClassName).unbind("focus",this._showDatepicker).unbind("keydown",this._doKeyDown).unbind("keypress",this._doKeyPress).unbind("keyup",this._doKeyUp)):("div"===i||"span"===i)&&s.removeClass(this.markerClassName).empty())},_enableDatepicker:function(e){var i,s,n=t(e),a=t.data(e,o);n.hasClass(this.markerClassName)&&(i=e.nodeName.toLowerCase(),"input"===i?(e.disabled=!1,a.trigger.filter("button").each(function(){this.disabled=!1}).end().filter("img").css({opacity:"1.0",cursor:""})):("div"===i||"span"===i)&&(s=n.children("."+this._inlineClass),s.children().removeClass("ui-state-disabled"),s.find("select.ui-datepicker-month, select.ui-datepicker-year").prop("disabled",!1)),this._disabledInputs=t.map(this._disabledInputs,function(t){return t===e?null:t}))},_disableDatepicker:function(e){var i,s,n=t(e),a=t.data(e,o);n.hasClass(this.markerClassName)&&(i=e.nodeName.toLowerCase(),"input"===i?(e.disabled=!0,a.trigger.filter("button").each(function(){this.disabled=!0}).end().filter("img").css({opacity:"0.5",cursor:"default"})):("div"===i||"span"===i)&&(s=n.children("."+this._inlineClass),s.children().addClass("ui-state-disabled"),s.find("select.ui-datepicker-month, select.ui-datepicker-year").prop("disabled",!0)),this._disabledInputs=t.map(this._disabledInputs,function(t){return t===e?null:t}),this._disabledInputs[this._disabledInputs.length]=e)},_isDisabledDatepicker:function(t){if(!t)return!1;for(var e=0;this._disabledInputs.length>e;e++)if(this._disabledInputs[e]===t)return!0;return!1},
        _getInst:function(e){try{return t.data(e,o)}catch(i){throw"Missing instance data for this datepicker"}},_optionDatepicker:function(i,s,a){var o,r,l,h,c=this._getInst(i);return 2===arguments.length&&"string"==typeof s?"defaults"===s?t.extend({},t.datepicker._defaults):c?"all"===s?t.extend({},c.settings):this._get(c,s):null:(o=s||{},"string"==typeof s&&(o={},o[s]=a),c&&(this._curInst===c&&this._hideDatepicker(),r=this._getDateDatepicker(i,!0),l=this._getMinMaxDate(c,"min"),h=this._getMinMaxDate(c,"max"),n(c.settings,o),null!==l&&o.dateFormat!==e&&o.minDate===e&&(c.settings.minDate=this._formatDate(c,l)),null!==h&&o.dateFormat!==e&&o.maxDate===e&&(c.settings.maxDate=this._formatDate(c,h)),"disabled"in o&&(o.disabled?this._disableDatepicker(i):this._enableDatepicker(i)),this._attachments(t(i),c),this._autoSize(c),this._setDate(c,r),this._updateAlternate(c),this._updateDatepicker(c)),e)},_changeDatepicker:function(t,e,i){this._optionDatepicker(t,e,i)},
        _refreshDatepicker:function(t){var e=this._getInst(t);
            e&&this._updateDatepicker(e)},
        _setDateDatepicker:function(t,e){var i=this._getInst(t);i&&(this._setDate(i,e),this._updateDatepicker(i),this._updateAlternate(i))},_getDateDatepicker:function(t,e){var i=this._getInst(t);return i&&!i.inline&&this._setDateFromField(i,e),i?this._getDate(i):null},_doKeyDown:function(e){var i,s,n,a=t.datepicker._getInst(e.target),o=!0,r=a.dpDiv.is(".ui-datepicker-rtl");if(a._keyEvent=!0,t.datepicker._datepickerShowing)switch(e.keyCode){case 9:t.datepicker._hideDatepicker(),o=!1;break;case 13:return n=t("td."+t.datepicker._dayOverClass+":not(."+t.datepicker._currentClass+")",a.dpDiv),n[0]&&t.datepicker._selectDay(e.target,a.selectedMonth,a.selectedYear,n[0]),i=t.datepicker._get(a,"onSelect"),i?(s=t.datepicker._formatDate(a),i.apply(a.input?a.input[0]:null,[s,a])):t.datepicker._hideDatepicker(),!1;case 27:t.datepicker._hideDatepicker();break;case 33:t.datepicker._adjustDate(e.target,e.ctrlKey?-t.datepicker._get(a,"stepBigMonths"):-t.datepicker._get(a,"stepMonths"),"M");break;case 34:t.datepicker._adjustDate(e.target,e.ctrlKey?+t.datepicker._get(a,"stepBigMonths"):+t.datepicker._get(a,"stepMonths"),"M");break;case 35:(e.ctrlKey||e.metaKey)&&t.datepicker._clearDate(e.target),o=e.ctrlKey||e.metaKey;break;case 36:(e.ctrlKey||e.metaKey)&&t.datepicker._gotoToday(e.target),o=e.ctrlKey||e.metaKey;break;case 37:(e.ctrlKey||e.metaKey)&&t.datepicker._adjustDate(e.target,r?1:-1,"D"),o=e.ctrlKey||e.metaKey,e.originalEvent.altKey&&t.datepicker._adjustDate(e.target,e.ctrlKey?-t.datepicker._get(a,"stepBigMonths"):-t.datepicker._get(a,"stepMonths"),"M");break;case 38:(e.ctrlKey||e.metaKey)&&t.datepicker._adjustDate(e.target,-7,"D"),o=e.ctrlKey||e.metaKey;break;case 39:(e.ctrlKey||e.metaKey)&&t.datepicker._adjustDate(e.target,r?-1:1,"D"),o=e.ctrlKey||e.metaKey,e.originalEvent.altKey&&t.datepicker._adjustDate(e.target,e.ctrlKey?+t.datepicker._get(a,"stepBigMonths"):+t.datepicker._get(a,"stepMonths"),"M");break;case 40:(e.ctrlKey||e.metaKey)&&t.datepicker._adjustDate(e.target,7,"D"),o=e.ctrlKey||e.metaKey;break;default:o=!1}else 36===e.keyCode&&e.ctrlKey?t.datepicker._showDatepicker(this):o=!1;o&&(e.preventDefault(),e.stopPropagation())},_doKeyPress:function(i){var s,n,a=t.datepicker._getInst(i.target);return t.datepicker._get(a,"constrainInput")?(s=t.datepicker._possibleChars(t.datepicker._get(a,"dateFormat")),n=String.fromCharCode(null==i.charCode?i.keyCode:i.charCode),i.ctrlKey||i.metaKey||" ">n||!s||s.indexOf(n)>-1):e},_doKeyUp:function(e){var i,s=t.datepicker._getInst(e.target);if(s.input.val()!==s.lastVal)try{
    i=t.datepicker.parseDate(t.datepicker._get(s,"dateFormat"),
        s.input?s.input.val():null,t.datepicker._getFormatConfig(s)),i&&(t.datepicker._setDateFromField(s),t.datepicker._updateAlternate(s),t.datepicker._updateDatepicker(s))}catch(n){}return!0},_showDatepicker:function(e){if(e=e.target||e,"input"!==e.nodeName.toLowerCase()&&(e=t("input",e.parentNode)[0]),!t.datepicker._isDisabledDatepicker(e)&&t.datepicker._lastInput!==e){var i,s,a,o,r,l,h;i=t.datepicker._getInst(e),t.datepicker._curInst&&t.datepicker._curInst!==i&&(t.datepicker._curInst.dpDiv.stop(!0,!0),i&&t.datepicker._datepickerShowing&&t.datepicker._hideDatepicker(t.datepicker._curInst.input[0])),s=t.datepicker._get(i,"beforeShow"),a=s?s.apply(e,[e,i]):{},a!==!1&&(n(i.settings,a),i.lastVal=null,t.datepicker._lastInput=e,t.datepicker._setDateFromField(i),t.datepicker._inDialog&&(e.value=""),t.datepicker._pos||(t.datepicker._pos=t.datepicker._findPos(e),t.datepicker._pos[1]+=e.offsetHeight),o=!1,t(e).parents().each(function(){return o|="fixed"===t(this).css("position"),!o}),r={left:t.datepicker._pos[0],top:t.datepicker._pos[1]},t.datepicker._pos=null,i.dpDiv.empty(),i.dpDiv.css({position:"absolute",display:"block",top:"-1000px"}),t.datepicker._updateDatepicker(i),r=t.datepicker._checkOffset(i,r,o),i.dpDiv.css({position:t.datepicker._inDialog&&t.blockUI?"static":o?"fixed":"absolute",display:"none",left:r.left+"px",top:r.top+"px"}),i.inline||(l=t.datepicker._get(i,"showAnim"),h=t.datepicker._get(i,"duration"),i.dpDiv.zIndex(t(e).zIndex()+1),t.datepicker._datepickerShowing=!0,t.effects&&t.effects.effect[l]?i.dpDiv.show(l,t.datepicker._get(i,"showOptions"),h):i.dpDiv[l||"show"](l?h:null),t.datepicker._shouldFocusInput(i)&&i.input.focus(),t.datepicker._curInst=i))}},
    _updateDatepicker:function(e){
        this.maxRows=4,
            a=e,e.dpDiv.empty().append(this._generateHTML(e)),
            this._attachHandlers(e),
            e.dpDiv.find("."+this._dayOverClass+" a").mouseover();
        var i,
            s=this._getNumberOfMonths(e),
            n=s[1],o=17;e.dpDiv.removeClass("ui-datepicker-multi-2 ui-datepicker-multi-3 ui-datepicker-multi-4").width(""),n>1&&e.dpDiv.addClass("ui-datepicker-multi-"+n).css("width",o*n+"em"),e.dpDiv[(1!==s[0]||1!==s[1]?"add":"remove")+"Class"]("ui-datepicker-multi"),e.dpDiv[(this._get(e,"isRTL")?"add":"remove")+"Class"]("ui-datepicker-rtl"),e===t.datepicker._curInst&&t.datepicker._datepickerShowing&&t.datepicker._shouldFocusInput(e)&&e.input.focus(),e.yearshtml&&(i=e.yearshtml,setTimeout(function(){i===e.yearshtml&&e.yearshtml&&e.dpDiv.find("select.ui-datepicker-year:first").replaceWith(e.yearshtml),i=e.yearshtml=null},0))
    }
        ,
        _shouldFocusInput:function(t){return t.input&&t.input.is(":visible")&&!t.input.is(":disabled")&&!t.input.is(":focus")}
        ,
        _checkOffset:function(e,i,s){var n=e.dpDiv.outerWidth(),a=e.dpDiv.outerHeight(),o=e.input?e.input.outerWidth():0,r=e.input?e.input.outerHeight():0,l=document.documentElement.clientWidth+(s?0:t(document).scrollLeft()),h=document.documentElement.clientHeight+(s?0:t(document).scrollTop());return i.left-=this._get(e,"isRTL")?n-o:0,i.left-=s&&i.left===e.input.offset().left?t(document).scrollLeft():0,i.top-=s&&i.top===e.input.offset().top+r?t(document).scrollTop():0,i.left-=Math.min(i.left,i.left+n>l&&l>n?Math.abs(i.left+n-l):0),i.top-=Math.min(i.top,i.top+a>h&&h>a?Math.abs(a+r):0),i},
        _findPos:function(e){for(var i,s=this._getInst(e),n=this._get(s,"isRTL");e&&("hidden"===e.type||1!==e.nodeType||t.expr.filters.hidden(e));)e=e[n?"previousSibling":"nextSibling"];return i=t(e).offset(),[i.left,i.top]},_hideDatepicker:function(e){var i,s,n,a,r=this._curInst;!r||e&&r!==t.data(e,o)||this._datepickerShowing&&(i=this._get(r,"showAnim"),s=this._get(r,"duration"),n=function(){t.datepicker._tidyDialog(r)},t.effects&&(t.effects.effect[i]||t.effects[i])?r.dpDiv.hide(i,t.datepicker._get(r,"showOptions"),s,n):r.dpDiv["slideDown"===i?"slideUp":"fadeIn"===i?"fadeOut":"hide"](i?s:null,n),i||n(),this._datepickerShowing=!1,a=this._get(r,"onClose"),a&&a.apply(r.input?r.input[0]:null,[r.input?r.input.val():"",r]),this._lastInput=null,this._inDialog&&(this._dialogInput.css({position:"absolute",left:"0",top:"-100px"}),t.blockUI&&(t.unblockUI(),t("body").append(this.dpDiv))),this._inDialog=!1)},_tidyDialog:function(t){t.dpDiv.removeClass(this._dialogClass).unbind(".ui-datepicker-calendar")},_checkExternalClick:function(e){if(t.datepicker._curInst){var i=t(e.target),s=t.datepicker._getInst(i[0]);(i[0].id!==t.datepicker._mainDivId&&0===i.parents("#"+t.datepicker._mainDivId).length&&!i.hasClass(t.datepicker.markerClassName)&&!i.closest("."+t.datepicker._triggerClass).length&&t.datepicker._datepickerShowing&&(!t.datepicker._inDialog||!t.blockUI)||i.hasClass(t.datepicker.markerClassName)&&t.datepicker._curInst!==s)&&t.datepicker._hideDatepicker()}},_adjustDate:function(e,i,s){var n=t(e),a=this._getInst(n[0]);this._isDisabledDatepicker(n[0])||(this._adjustInstDate(a,i+("M"===s?this._get(a,"showCurrentAtPos"):0),s),this._updateDatepicker(a))},_gotoToday:function(e){var i,s=t(e),n=this._getInst(s[0]);this._get(n,"gotoCurrent")&&n.currentDay?(n.selectedDay=n.currentDay,n.drawMonth=n.selectedMonth=n.currentMonth,n.drawYear=n.selectedYear=n.currentYear):(i=new Date,n.selectedDay=i.getDate(),n.drawMonth=n.selectedMonth=i.getMonth(),n.drawYear=n.selectedYear=i.getFullYear()),this._notifyChange(n),this._adjustDate(s)},_selectMonthYear:function(e,i,s){var n=t(e),a=this._getInst(n[0]);a["selected"+("M"===s?"Month":"Year")]=a["draw"+("M"===s?"Month":"Year")]=parseInt(i.options[i.selectedIndex].value,10),this._notifyChange(a),this._adjustDate(n)},_selectDay:function(e,i,s,n){var a,o=t(e);t(n).hasClass(this._unselectableClass)||this._isDisabledDatepicker(o[0])||(a=this._getInst(o[0]),a.selectedDay=a.currentDay=t("a",n).html(),a.selectedMonth=a.currentMonth=i,a.selectedYear=a.currentYear=s,this._selectDate(e,this._formatDate(a,a.currentDay,a.currentMonth,a.currentYear)))},_clearDate:function(e){var i=t(e);this._selectDate(i,"")},_selectDate:function(e,i){var s,n=t(e),a=this._getInst(n[0]);i=null!=i?i:this._formatDate(a),a.input&&a.input.val(i),this._updateAlternate(a),s=this._get(a,"onSelect"),s?s.apply(a.input?a.input[0]:null,[i,a]):a.input&&a.input.trigger("change"),a.inline?this._updateDatepicker(a):(this._hideDatepicker(),this._lastInput=a.input[0],"object"!=typeof a.input[0]&&a.input.focus(),this._lastInput=null)},_updateAlternate:function(e){var i,s,n,a=this._get(e,"altField");a&&(i=this._get(e,"altFormat")||this._get(e,"dateFormat"),s=this._getDate(e),n=this.formatDate(i,s,this._getFormatConfig(e)),t(a).each(function(){t(this).val(n)}))},noWeekends:function(t){var e=t.getDay();return[e>0&&6>e,""]},iso8601Week:function(t){var e,i=new Date(t.getTime());return i.setDate(i.getDate()+4-(i.getDay()||7)),e=i.getTime(),i.setMonth(0),i.setDate(1),Math.floor(Math.round((e-i)/864e5)/7)+1},
        parseDate:function(i,s,n){
            if(null==i||null==s)throw"Invalid arguments";
            if(s="object"==typeof s?""+s:s+"",""===s)return null;
            var a,o,r,l,h=0,c=(n?n.shortYearCutoff:null)||this._defaults.shortYearCutoff,u="string"!=typeof c?c:(new Date).getFullYear()%100+parseInt(c,10),d=(n?n.dayNamesShort:null)||this._defaults.dayNamesShort,p=(n?n.dayNames:null)||this._defaults.dayNames,f=(n?n.monthNamesShort:null)||this._defaults.monthNamesShort,
                g=(n?n.monthNames:null)||this._defaults.monthNames,m=-1,v=-1,_=-1,b=-1,y=!1,w=function(t){var e=i.length>a+1&&i.charAt(a+1)===t;return e&&a++,e},D=function(t){var e=w(t),i="@"===t?14:"!"===t?20:"y"===t&&e?4:"o"===t?3:2,n=RegExp("^\\d{1,"+i+"}"),a=s.substring(h).match(n);if(!a)throw"Missing number at position "+h;return h+=a[0].length,parseInt(a[0],10)},C=function(i,n,a){var o=-1,r=t.map(w(i)?a:n,function(t,e){return[[e,t]]}).sort(function(t,e){return-(t[1].length-e[1].length)});if(t.each(r,function(t,i){var n=i[1];return s.substr(h,n.length).toLowerCase()===n.toLowerCase()?(o=i[0],h+=n.length,!1):e}),-1!==o)return o+1;throw"Unknown name at position "+h},x=function(){if(s.charAt(h)!==i.charAt(a))throw"Unexpected literal at position "+h;h++};for(a=0;i.length>a;a++)if(y)"'"!==i.charAt(a)||w("'")?x():y=!1;
            else switch(i.charAt(a)){case"d":_=D("d");
                    break;
                    case"D":C("D",d,p);
                        break;
                    case"o":b=D("o");
                        break;
                    case"m":v=D("m");
                        break;
                    case"M":v=C("M",f,g);
                        break;
                    case"y":m=D("y");
                        break;
                    case"@":l=new Date(D("@")),m=l.getFullYear(),v=l.getMonth()+1,_=l.getDate();
                        break;
                    case"!":l=new Date((D("!")-this._ticksTo1970)/1e4),m=l.getFullYear(),v=l.getMonth()+1,_=l.getDate();
                        break;
                    case"'":w("'")?x():y=!0;
                        break;
                    default:x()
                }
            if(s.length>h&&(r=s.substr(h),!/^\s+/.test(r)))throw"Extra/unparsed characters found in date: "+r;
            if(-1===m?m=(new Date).getFullYear():100>m&&(m+=(new Date).getFullYear()-(new Date).getFullYear()%100+(u>=m?0:-100)),b>-1)for(v=1,_=b;o=this._getDaysInMonth(m,v-1),!(o>=_);)v++,_-=o;
            if(l=this._daylightSavingAdjust(new Date(m,v-1,_)),l.getFullYear()!==m||l.getMonth()+1!==v||l.getDate()!==_)throw"Invalid date";return l},ATOM:"yy-mm-dd",COOKIE:"D, dd M yy",ISO_8601:"yy-mm-dd",RFC_822:"D, d M y",RFC_850:"DD, dd-M-y",RFC_1036:"D, d M y",RFC_1123:"D, d M yy",RFC_2822:"D, d M yy",RSS:"D, d M y",TICKS:"!",TIMESTAMP:"@",W3C:"yy-mm-dd",_ticksTo1970:864e9*(718685+Math.floor(492.5)-Math.floor(19.7)+Math.floor(4.925)),
        formatDate:function(t,e,i){
            if(!e)return"";
            var s,n=(i?i.dayNamesShort:null)||this._defaults.dayNamesShort,a=(i?i.dayNames:null)||this._defaults.dayNames,
                o=(i?i.monthNamesShort:null)||this._defaults.monthNamesShort,r=(i?i.monthNames:null)||this._defaults.monthNames,
                l=function(e){var i=t.length>s+1&&t.charAt(s+1)===e;return i&&s++,i},
                h=function(t,e,i){var s=""+e;if(l(t))for(;i>s.length;)s="0"+s;return s
                }
                ,c=function(t,e,i,s){return l(t)?s[e]:i[e]},u="",d=!1;if(e)for(s=0;t.length>s;s++)if(d)"'"!==t.charAt(s)||l("'")?u+=t.charAt(s):d=!1;
            else switch(t.charAt(s)){
                    case"d":u+=h("d",e.getDate(),2);
                    break;
                    case"D":u+=c("D",e.getDay(),n,a);
                        break;
                    case"o":u+=h("o",Math.round((new Date(e.getFullYear(),e.getMonth(),e.getDate()).getTime()-new Date(e.getFullYear(),0,0).getTime())/864e5),3);
                        break;
                    case"m":u+=h("m",e.getMonth()+1,2);
                        break;
                    case"M":u+=c("M",e.getMonth(),o,r);
                        break;
                    case"y":u+=l("y")?e.getFullYear():(10>e.getYear()%100?"0":"")+e.getYear()%100;
                        break;
                    case"@":u+=e.getTime();
                        break;
                    case"!":u+=1e4*e.getTime()+this._ticksTo1970;
                        break;
                    case"'":l("'")?u+="'":d=!0;
                        break;
                    default:u+=t.charAt(s)
                }
            return u
        }
        ,_possibleChars:function(t){var e,i="",s=!1,n=function(i){var s=t.length>e+1&&t.charAt(e+1)===i;return s&&e++,s};for(e=0;t.length>e;e++)if(s)"'"!==t.charAt(e)||n("'")?i+=t.charAt(e):s=!1;else switch(t.charAt(e)){case"d":case"m":case"y":case"@":i+="0123456789";break;case"D":case"M":return null;case"'":n("'")?i+="'":s=!0;break;default:i+=t.charAt(e)}return i},_get:function(t,i){return t.settings[i]!==e?t.settings[i]:this._defaults[i]},
        _setDateFromField:function(t,e){
            if(t.input.val()!==t.lastVal){
                var i=this._get(t,"dateFormat"),
                s=t.lastVal=t.input?t.input.val():null,
                    n=this._getDefaultDate(t),a=n,o=this._getFormatConfig(t);try{a=this.parseDate(i,s,o)||n
                }catch(r){s=e?"":s
                }t.selectedDay=a.getDate(),t.drawMonth=t.selectedMonth=a.getMonth(),t.drawYear=t.selectedYear=a.getFullYear(),t.currentDay=s?a.getDate():0,t.currentMonth=s?a.getMonth():0,t.currentYear=s?a.getFullYear():0,this._adjustInstDate(t)
            }
        }
        ,_getDefaultDate:function(t){
            return this._restrictMinMax(t,this._determineDate(t,this._get(t,"defaultDate"),new Date))},
        _determineDate:function(e,i,s){var n=function(t){var e=new Date;return e.setDate(e.getDate()+t),e},a=function(i){try{return t.datepicker.parseDate(t.datepicker._get(e,"dateFormat"),i,t.datepicker._getFormatConfig(e))}catch(s){}for(var n=(i.toLowerCase().match(/^c/)?t.datepicker._getDate(e):null)||new Date,a=n.getFullYear(),o=n.getMonth(),r=n.getDate(),l=/([+\-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/g,h=l.exec(i);h;){switch(h[2]||"d"){case"d":case"D":r+=parseInt(h[1],10);break;case"w":case"W":r+=7*parseInt(h[1],10);break;case"m":case"M":o+=parseInt(h[1],10),r=Math.min(r,t.datepicker._getDaysInMonth(a,o));break;case"y":case"Y":a+=parseInt(h[1],10),r=Math.min(r,t.datepicker._getDaysInMonth(a,o))}h=l.exec(i)}return new Date(a,o,r)},o=null==i||""===i?s:"string"==typeof i?a(i):"number"==typeof i?isNaN(i)?s:n(i):new Date(i.getTime());return o=o&&"Invalid Date"==""+o?s:o,o&&(o.setHours(0),o.setMinutes(0),o.setSeconds(0),o.setMilliseconds(0)),this._daylightSavingAdjust(o)},_daylightSavingAdjust:function(t){return t?(t.setHours(t.getHours()>12?t.getHours()+2:0),t):null},_setDate:function(t,e,i){var s=!e,n=t.selectedMonth,a=t.selectedYear,o=this._restrictMinMax(t,this._determineDate(t,e,new Date));t.selectedDay=t.currentDay=o.getDate(),t.drawMonth=t.selectedMonth=t.currentMonth=o.getMonth(),t.drawYear=t.selectedYear=t.currentYear=o.getFullYear(),n===t.selectedMonth&&a===t.selectedYear||i||this._notifyChange(t),this._adjustInstDate(t),t.input&&t.input.val(s?"":this._formatDate(t))},_getDate:function(t){var e=!t.currentYear||t.input&&""===t.input.val()?null:this._daylightSavingAdjust(new Date(t.currentYear,t.currentMonth,t.currentDay));return e},_attachHandlers:function(e){var i=this._get(e,"stepMonths"),s="#"+e.id.replace(/\\\\/g,"\\");e.dpDiv.find("[data-handler]").map(function(){var e={prev:function(){t.datepicker._adjustDate(s,-i,"M")},next:function(){t.datepicker._adjustDate(s,+i,"M")},hide:function(){t.datepicker._hideDatepicker()},today:function(){t.datepicker._gotoToday(s)},selectDay:function(){return t.datepicker._selectDay(s,+this.getAttribute("data-month"),+this.getAttribute("data-year"),this),!1},selectMonth:function(){return t.datepicker._selectMonthYear(s,this,"M"),!1},selectYear:function(){return t.datepicker._selectMonthYear(s,this,"Y"),!1}};t(this).bind(this.getAttribute("data-event"),e[this.getAttribute("data-handler")])})},_generateHTML:function(t){var e,i,s,n,a,o,r,l,h,c,u,d,p,f,g,m,v,_,b,y,w,D,C,x,k,M,T,I,P,S,E,z,H,A,N,W,F,O,R,L=new Date,j=this._daylightSavingAdjust(new Date(L.getFullYear(),L.getMonth(),L.getDate())),Y=this._get(t,"isRTL"),B=this._get(t,"showButtonPanel"),$=this._get(t,"hideIfNoPrevNext"),q=this._get(t,"navigationAsDateFormat"),U=this._getNumberOfMonths(t),K=this._get(t,"showCurrentAtPos"),V=this._get(t,"stepMonths"),X=1!==U[0]||1!==U[1],Q=this._daylightSavingAdjust(t.currentDay?new Date(t.currentYear,t.currentMonth,t.currentDay):new Date(9999,9,9)),G=this._getMinMaxDate(t,"min"),J=this._getMinMaxDate(t,"max"),Z=t.drawMonth-K,te=t.drawYear;if(0>Z&&(Z+=12,te--),J)for(e=this._daylightSavingAdjust(new Date(J.getFullYear(),J.getMonth()-U[0]*U[1]+1,J.getDate())),e=G&&G>e?G:e;this._daylightSavingAdjust(new Date(te,Z,1))>e;)Z--,0>Z&&(Z=11,te--);for(t.drawMonth=Z,t.drawYear=te,i=this._get(t,"prevText"),i=q?this.formatDate(i,this._daylightSavingAdjust(new Date(te,Z-V,1)),this._getFormatConfig(t)):i,s=this._canAdjustMonth(t,-1,te,Z)?"<a class='ui-datepicker-prev ui-corner-all' data-handler='prev' data-event='click' title='"+i+"'><span class='ui-icon ui-icon-circle-triangle-"+(Y?"e":"w")+"'>"+i+"</span></a>":$?"":"<a class='ui-datepicker-prev ui-corner-all ui-state-disabled' title='"+i+"'><span class='ui-icon ui-icon-circle-triangle-"+(Y?"e":"w")+"'>"+i+"</span></a>",n=this._get(t,"nextText"),n=q?this.formatDate(n,this._daylightSavingAdjust(new Date(te,Z+V,1)),this._getFormatConfig(t)):n,a=this._canAdjustMonth(t,1,te,Z)?"<a class='ui-datepicker-next ui-corner-all' data-handler='next' data-event='click' title='"+n+"'><span class='ui-icon ui-icon-circle-triangle-"+(Y?"w":"e")+"'>"+n+"</span></a>":$?"":"<a class='ui-datepicker-next ui-corner-all ui-state-disabled' title='"+n+"'><span class='ui-icon ui-icon-circle-triangle-"+(Y?"w":"e")+"'>"+n+"</span></a>",o=this._get(t,"currentText"),r=this._get(t,"gotoCurrent")&&t.currentDay?Q:j,o=q?this.formatDate(o,r,this._getFormatConfig(t)):o,l=t.inline?"":"<button type='button' class='ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all' data-handler='hide' data-event='click'>"+this._get(t,"closeText")+"</button>",h=B?"<div class='ui-datepicker-buttonpane ui-widget-content'>"+(Y?l:"")+(this._isInRange(t,r)?"<button type='button' class='ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all' data-handler='today' data-event='click'>"+o+"</button>":"")+(Y?"":l)+"</div>":"",c=parseInt(this._get(t,"firstDay"),10),c=isNaN(c)?0:c,u=this._get(t,"showWeek"),d=this._get(t,"dayNames"),p=this._get(t,"dayNamesMin"),f=this._get(t,"monthNames"),g=this._get(t,"monthNamesShort"),m=this._get(t,"beforeShowDay"),v=this._get(t,"showOtherMonths"),_=this._get(t,"selectOtherMonths"),b=this._getDefaultDate(t),y="",D=0;U[0]>D;D++){for(C="",this.maxRows=4,x=0;U[1]>x;x++){if(k=this._daylightSavingAdjust(new Date(te,Z,t.selectedDay)),M=" ui-corner-all",T="",X){if(T+="<div class='ui-datepicker-group",U[1]>1)switch(x){case 0:T+=" ui-datepicker-group-first",M=" ui-corner-"+(Y?"right":"left");

            break;
            case U[1]-1:T+=" ui-datepicker-group-last",M=" ui-corner-"+(Y?"left":"right");
            break;default:T+=" ui-datepicker-group-middle",M=""}T+="'>"}for(T+="<div class='ui-datepicker-header ui-widget-header ui-helper-clearfix"+M+"'>"+(/all|left/.test(M)&&0===D?Y?a:s:"")+(/all|right/.test(M)&&0===D?Y?s:a:"")+this._generateMonthYearHeader(t,Z,te,G,J,D>0||x>0,f,g)+"</div><table class='ui-datepicker-calendar'><thead><tr>",I=u?"<th class='ui-datepicker-week-col'>"+this._get(t,"weekHeader")+"</th>":"",w=0;7>w;w++)P=(w+c)%7,I+="<th"+((w+c+6)%7>=5?" class='ui-datepicker-week-end'":"")+"><span title='"+d[P]+"'>"+p[P]+"</span></th>";for(T+=I+"</tr></thead><tbody>",S=this._getDaysInMonth(te,Z),te===t.selectedYear&&Z===t.selectedMonth&&(t.selectedDay=Math.min(t.selectedDay,S)),E=(this._getFirstDayOfMonth(te,Z)-c+7)%7,z=Math.ceil((E+S)/7),H=X?this.maxRows>z?this.maxRows:z:z,this.maxRows=H,A=this._daylightSavingAdjust(new Date(te,Z,1-E)),N=0;H>N;N++){for(T+="<tr>",W=u?"<td class='ui-datepicker-week-col'>"+this._get(t,"calculateWeek")(A)+"</td>":"",w=0;7>w;w++)F=m?m.apply(t.input?t.input[0]:null,[A]):[!0,""],O=A.getMonth()!==Z,R=O&&!_||!F[0]||G&&G>A||J&&A>J,W+="<td class='"+((w+c+6)%7>=5?" ui-datepicker-week-end":"")+(O?" ui-datepicker-other-month":"")+(A.getTime()===k.getTime()&&Z===t.selectedMonth&&t._keyEvent||b.getTime()===A.getTime()&&b.getTime()===k.getTime()?" "+this._dayOverClass:"")+(R?" "+this._unselectableClass+" ui-state-disabled":"")+(O&&!v?"":" "+F[1]+(A.getTime()===Q.getTime()?" "+this._currentClass:"")+(A.getTime()===j.getTime()?" ui-datepicker-today":""))+"'"+(O&&!v||!F[2]?"":" title='"+F[2].replace(/'/g,"&#39;")+"'")+(R?"":" data-handler='selectDay' data-event='click' data-month='"+A.getMonth()+"' data-year='"+A.getFullYear()+"'")+">"+(O&&!v?"&#xa0;":R?"<span class='ui-state-default'>"+A.getDate()+"</span>":"<a class='ui-state-default"+(A.getTime()===j.getTime()?" ui-state-highlight":"")+(A.getTime()===Q.getTime()?" ui-state-active":"")+(O?" ui-priority-secondary":"")+"' href='#'>"+A.getDate()+"</a>")+"</td>",A.setDate(A.getDate()+1),A=this._daylightSavingAdjust(A);T+=W+"</tr>"}Z++,Z>11&&(Z=0,te++),T+="</tbody></table>"+(X?"</div>"+(U[0]>0&&x===U[1]-1?"<div class='ui-datepicker-row-break'></div>":""):""),C+=T}y+=C}return y+=h,t._keyEvent=!1,y},

        _generateMonthYearHeader:function(t,e,i,s,n,a,o,r){

            var l,h,c,u,d,p,f,g,
                m=this._get(t,"changeMonth"),
                v=this._get(t,"changeYear"),
                _=this._get(t,"showMonthAfterYear"),
                b="<div class='ui-datepicker-title'>",
                y="";

            if(a||!m)y+="<span class='ui-datepicker-month'>"+o[e]+"</span>";
            else{
                for(l=s&&s.getFullYear()===i,
                        h=n&&n.getFullYear()===i,
                        y+="<select class='ui-datepicker-month' data-handler='selectMonth' data-event='change'>",
                        c=0;12>c;c++)
                    (!l||c>=s.getMonth())&&(!h||n.getMonth()>=c)&&(y+="<option value='"+c+"'"+(c===e?" selected='selected'":"")+">"+r[c]+"</option>");y+="</select>"
            }
            if(_||(b+=y+(!a&&m&&v?"":"&#xa0;")),!t.yearshtml)
                if(t.yearshtml="",a||!v)b+="<span class='ui-datepicker-year'>"+i+"</span>";
            else{
                for(u=this._get(t,"yearRange").split(":"),
                        d=(new Date).getFullYear(),
                        p=function(t){var e=t.match(/c[+\-].*/)?i+parseInt(t.substring(1),10):t.match(/[+\-].*/)?d+parseInt(t,10):parseInt(t,10);return isNaN(e)?d:e},
                        f=p(u[0]),g=Math.max(f,p(u[1]||"")),
                        f=s?Math.max(f,s.getFullYear()):f,g=n?Math.min(g,n.getFullYear()):g,t.yearshtml+="<select class='ui-datepicker-year' data-handler='selectYear' data-event='change'>";g>=f;f++)t.yearshtml+="<option value='"+f+"'"+(f===i?" selected='selected'":"")+">"+f+"</option>";t.yearshtml+="</select>",b+=t.yearshtml,t.yearshtml=null
            }
            return b+=this._get(t,"yearSuffix"),_&&(b+=(!a&&m&&v?"":"&#xa0;")+y),b+="</div>"
        },
        _adjustInstDate:function(t,e,i){
            var s=t.drawYear+("Y"===i?e:0),
                n=t.drawMonth+("M"===i?e:0),
                a=Math.min(t.selectedDay, this._getDaysInMonth(s,n))+("D"===i?e:0),o=this._restrictMinMax(t,this._daylightSavingAdjust(new Date(s,n,a)));
            t.selectedDay=o.getDate(), t.drawMonth=t.selectedMonth=o.getMonth(),
                t.drawYear=t.selectedYear=o.getFullYear(),("M"===i||"Y"===i)&&this._notifyChange(t)
        }
        ,_restrictMinMax:function(t,e){
            var i=this._getMinMaxDate(t,"min"),
                s=this._getMinMaxDate(t,"max"),n=i&&i>e?i:e;
            return s&&n>s?s:n
        }
        ,_notifyChange:function(t){

            var e=this._get(t,"onChangeMonthYear");

            e&&e.apply(t.input?t.input[0]:null,
                [t.selectedYear,t.selectedMonth+1,t]
            )

        }
        ,_getNumberOfMonths:function(t){var e=this._get(t,"numberOfMonths");return null==e?[1,1]:"number"==typeof e?[1,e]:e}
        ,_getMinMaxDate:function(t,e){
            return this._determineDate(t,this._get(t,e+"Date"),null)
        }
        ,_getDaysInMonth:function(t,e){return 32-this._daylightSavingAdjust(new Date(t,e,32)).getDate()},
        _getFirstDayOfMonth:function(t,e){return new Date(t,e,1).getDay()},
        _canAdjustMonth:function(t,e,i,s){
            var n=this._getNumberOfMonths(t),a=this._daylightSavingAdjust(new Date(i,s+(0>e?e:n[0]*n[1]),1));
            return 0>e&&a.setDate(this._getDaysInMonth(a.getFullYear(),a.getMonth())),this._isInRange(t,a)
        },
        _isInRange:function(t,e){var i,s,n=this._getMinMaxDate(t,"min"),a=this._getMinMaxDate(t,"max"),o=null,r=null,l=this._get(t,"yearRange");return l&&(i=l.split(":"),s=(new Date).getFullYear(),o=parseInt(i[0],10),r=parseInt(i[1],10),i[0].match(/[+\-].*/)&&(o+=s),i[1].match(/[+\-].*/)&&(r+=s)),(!n||e.getTime()>=n.getTime())&&(!a||e.getTime()<=a.getTime())&&(!o||e.getFullYear()>=o)&&(!r||r>=e.getFullYear())}
        ,_getFormatConfig:function(t){var e=this._get(t,"shortYearCutoff");return e="string"!=typeof e?e:(new Date).getFullYear()%100+parseInt(e,10),{shortYearCutoff:e,dayNamesShort:this._get(t,"dayNamesShort"),dayNames:this._get(t,"dayNames"),
            monthNamesShort:this._get(t,"monthNamesShort"),monthNames:this._get(t,"monthNames")}
        }
        ,_formatDate:function(t,e,i,s){
            e||(t.currentDay=t.selectedDay,t.currentMonth=t.selectedMonth,t.currentYear=t.selectedYear);
            var n=e?"object"==typeof e?e:this._daylightSavingAdjust(new Date(s,i,e)):this._daylightSavingAdjust(new Date(t.currentYear,t.currentMonth,t.currentDay));
            return this.formatDate(this._get(t,"dateFormat"),n,
                this._getFormatConfig(t))}
    }),
        t.fn.datepicker=function(e){if(!this.length)return this;t.datepicker.initialized||(t(document).mousedown(t.datepicker._checkExternalClick),t.datepicker.initialized=!0),0===t("#"+t.datepicker._mainDivId).length&&t("body").append(t.datepicker.dpDiv);var i=Array.prototype.slice.call(arguments,1);
            return"string"!=typeof e||"isDisabled"!==e&&"getDate"!==e&&"widget"!==e?"option"===e&&2===arguments.length&&"string"==typeof arguments[1]?t.datepicker["_"+e+"Datepicker"].apply(t.datepicker,[this[0]].concat(i)):this.each(function(){"string"==typeof e?t.datepicker["_"+e+"Datepicker"].apply(t.datepicker,[this].concat(i)):t.datepicker._attachDatepicker(this,e)}):t.datepicker["_"+e+"Datepicker"].apply(t.datepicker,[this[0]].concat(i))
        },
        t.datepicker=new i,t.datepicker.initialized=!1,
        t.datepicker.uuid=(new Date).getTime(),t.datepicker.version="1.10.3"
}

(jQuery),function(t){var e={buttons:!0,height:!0,maxHeight:!0,
    maxWidth:!0,minHeight:!0,minWidth:!0,
    width:!0},i={maxHeight:!0,maxWidth:!0,minHeight:!0,minWidth:!0};
    t.widget("ui.dialog",
        {version:"1.10.3",options:{appendTo:"body",autoOpen:!0,
            buttons:[],closeOnEscape:!0,closeText:"close",
            dialogClass:"",draggable:!0,hide:null,height:"auto",
            maxHeight:null,maxWidth:null,minHeight:150,
            minWidth:150,
            modal:!1,
            position:{my:"center",at:"center",of:window,
                collision:"fit",
                //,
            using:function(e){
                var i=t(this).css(e).offset().top;
    //0>i&&t(this).css("top",e.top+i)
    0>i&&t(this).css("top",100)
            }
        },
    resizable:!0,show:null,title:null,width:300,beforeClose:null,close:null,drag:null,dragStart:null,dragStop:null,focus:null,open:null,resize:null,resizeStart:null,resizeStop:null},_create:function(){this.originalCss={display:this.element[0].style.display,width:this.element[0].style.width,minHeight:this.element[0].style.minHeight,maxHeight:this.element[0].style.maxHeight,height:this.element[0].style.height},this.originalPosition={parent:this.element.parent(),index:this.element.parent().children().index(this.element)},this.originalTitle=this.element.attr("title"),this.options.title=this.options.title||this.originalTitle,this._createWrapper(),this.element.show().removeAttr("title").addClass("ui-dialog-content ui-widget-content").appendTo(this.uiDialog),this._createTitlebar(),this._createButtonPane(),this.options.draggable&&t.fn.draggable&&this._makeDraggable(),this.options.resizable&&t.fn.resizable&&this._makeResizable(),this._isOpen=!1},_init:function(){this.options.autoOpen&&this.open()},_appendTo:function(){var e=this.options.appendTo;return e&&(e.jquery||e.nodeType)?t(e):this.document.find(e||"body").eq(0)},_destroy:function(){var t,e=this.originalPosition;this._destroyOverlay(),this.element.removeUniqueId().removeClass("ui-dialog-content ui-widget-content").css(this.originalCss).detach(),this.uiDialog.stop(!0,!0).remove(),this.originalTitle&&this.element.attr("title",this.originalTitle),t=e.parent.children().eq(e.index),t.length&&t[0]!==this.element[0]?t.before(this.element):e.parent.append(this.element)},widget:function(){return this.uiDialog},disable:t.noop,enable:t.noop,close:function(e){var i=this;this._isOpen&&this._trigger("beforeClose",e)!==!1&&(this._isOpen=!1,this._destroyOverlay(),this.opener.filter(":focusable").focus().length||t(this.document[0].activeElement).blur(),this._hide(this.uiDialog,this.options.hide,function(){i._trigger("close",e)}))},isOpen:function(){return this._isOpen},moveToTop:function(){this._moveToTop()},_moveToTop:function(t,e){var i=!!this.uiDialog.nextAll(":visible").insertBefore(this.uiDialog).length;return i&&!e&&this._trigger("focus",t),i},open:function(){var e=this;return this._isOpen?(this._moveToTop()&&this._focusTabbable(),void 0):(this._isOpen=!0,this.opener=t(this.document[0].activeElement),this._size(),this._position(),this._createOverlay(),this._moveToTop(null,!0),this._show(this.uiDialog,this.options.show,function(){e._focusTabbable(),e._trigger("focus")}),this._trigger("open"),void 0)},_focusTabbable:function(){var t=this.element.find("[autofocus]");t.length||(t=this.element.find(":tabbable")),t.length||(t=this.uiDialogButtonPane.find(":tabbable")),t.length||(t=this.uiDialogTitlebarClose.filter(":tabbable")),t.length||(t=this.uiDialog),t.eq(0).focus()},_keepFocus:function(e){function i(){var e=this.document[0].activeElement,i=this.uiDialog[0]===e||t.contains(this.uiDialog[0],e);i||this._focusTabbable()}e.preventDefault(),i.call(this),this._delay(i)},_createWrapper:function(){
            this.uiDialog=t("<div>").addClass("ui-dialog ui-widget ui-widget-content ui-corner-all ui-front "+
            this.options.dialogClass).hide().attr({tabIndex:-1,role:"dialog"}).appendTo(this._appendTo()),
    this._on(this.uiDialog,
        {
            keydown:function(e){if(this.options.closeOnEscape&&!e.isDefaultPrevented()&&e.keyCode&&e.keyCode===t.ui.keyCode.ESCAPE)return e.preventDefault(),this.close(e),
        void 0;if(e.keyCode===t.ui.keyCode.TAB){var i=this.uiDialog.find(":tabbable"),s=i.filter(":first"),n=i.filter(":last");
        e.target!==n[0]&&e.target!==this.uiDialog[0]||e.shiftKey?e.target!==s[0]&&e.target!==this.uiDialog[0]||!e.shiftKey||(n.focus(1),e.preventDefault()):(s.focus(1),e.preventDefault())}},
        mousedown:function(t){this._moveToTop(t)&&this._focusTabbable()}}),this.element.find("[aria-describedby]").length||this.uiDialog.attr({"aria-describedby":this.element.uniqueId().attr("id")})},
    _createTitlebar:function(){
        var e;this.uiDialogTitlebar=t("<div>").addClass("ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix").prependTo(this.uiDialog),
            this._on(this.uiDialogTitlebar,{
                mousedown:function(e){t(e.target).closest(".ui-dialog-titlebar-close")||this.uiDialog.focus()}}),
            this.uiDialogTitlebarClose=t("<button></button>").button({label:this.options.closeText,icons:{primary:"ui-icon-closethick"},text:!1}).addClass("ui-dialog-titlebar-close").appendTo(this.uiDialogTitlebar),
            this._on(this.uiDialogTitlebarClose,{click:function(t){t.preventDefault(),this.close(t)}}),
            e=t("<span>").uniqueId().addClass("ui-dialog-title").prependTo(this.uiDialogTitlebar),
            this._title(e),this.uiDialog.attr({"aria-labelledby":e.attr("id")})},
            _title:function(t){this.options.title||t.html("&#160;"),t.text(this.options.title)},
            _createButtonPane:function(){this.uiDialogButtonPane=t("<div>").addClass("ui-dialog-buttonpane ui-widget-content ui-helper-clearfix"),
                this.uiButtonSet=t("<div>").addClass("ui-dialog-buttonset").appendTo(this.uiDialogButtonPane),
                this._createButtons()},
            _createButtons:function(){var e=this,i=this.options.buttons;
                return this.uiDialogButtonPane.remove(),this.uiButtonSet.empty(),
                    t.isEmptyObject(i)||t.isArray(i)&&!i.length?(this.uiDialog.removeClass("ui-dialog-buttons"),void 0):(t.each(i,function(i,s){var n,a;s=t.isFunction(s)?{click:s,text:i}:s,s=t.extend({type:"button"},s),n=s.click,s.click=function(){n.apply(e.element[0],arguments)},a={icons:s.icons,text:s.showText},delete s.icons,delete s.showText,t("<button></button>",s).button(a).appendTo(e.uiButtonSet)}),
                        this.uiDialog.addClass("ui-dialog-buttons"),
                        this.uiDialogButtonPane.appendTo(this.uiDialog),void 0)},
            _makeDraggable:function()
            {function e(t){return{position:t.position,offset:t.offset}}var i=this,s=this.options;this.uiDialog.draggable({cancel:".ui-dialog-content, .ui-dialog-titlebar-close",handle:".ui-dialog-titlebar",containment:"document",start:function(s,n){t(this).addClass("ui-dialog-dragging"),i._blockFrames(),i._trigger("dragStart",s,e(n))},drag:function(t,s){i._trigger("drag",t,e(s))},stop:function(n,a){s.position=[a.position.left-i.document.scrollLeft(),a.position.top-i.document.scrollTop()],t(this).removeClass("ui-dialog-dragging"),i._unblockFrames(),i._trigger("dragStop",n,e(a))}})},_makeResizable:function(){function e(t){return{originalPosition:t.originalPosition,originalSize:t.originalSize,position:t.position,size:t.size}}var i=this,s=this.options,n=s.resizable,a=this.uiDialog.css("position"),o="string"==typeof n?n:"n,e,s,w,se,sw,ne,nw";this.uiDialog.resizable({cancel:".ui-dialog-content",containment:"document",alsoResize:this.element,maxWidth:s.maxWidth,maxHeight:s.maxHeight,minWidth:s.minWidth,minHeight:this._minHeight(),handles:o,start:function(s,n){t(this).addClass("ui-dialog-resizing"),i._blockFrames(),i._trigger("resizeStart",s,e(n))},resize:function(t,s){i._trigger("resize",t,e(s))},stop:function(n,a){s.height=t(this).height(),s.width=t(this).width(),t(this).removeClass("ui-dialog-resizing"),i._unblockFrames(),i._trigger("resizeStop",n,e(a))}}).css("position",a)},_minHeight:function(){var t=this.options;return"auto"===t.height?t.minHeight:Math.min(t.minHeight,t.height)},_position:function(){var t=this.uiDialog.is(":visible");t||this.uiDialog.show(),this.uiDialog.position(this.options.position),t||this.uiDialog.hide()},_setOptions:function(s){var n=this,a=!1,o={};t.each(s,function(t,s){n._setOption(t,s),t in e&&(a=!0),t in i&&(o[t]=s)}),a&&(this._size(),this._position()),this.uiDialog.is(":data(ui-resizable)")&&this.uiDialog.resizable("option",o)},_setOption:function(t,e){var i,s,n=this.uiDialog;"dialogClass"===t&&n.removeClass(this.options.dialogClass).addClass(e),"disabled"!==t&&(this._super(t,e),"appendTo"===t&&this.uiDialog.appendTo(this._appendTo()),"buttons"===t&&this._createButtons(),"closeText"===t&&this.uiDialogTitlebarClose.button({label:""+e}),"draggable"===t&&(i=n.is(":data(ui-draggable)"),i&&!e&&n.draggable("destroy"),!i&&e&&this._makeDraggable()),"position"===t&&this._position(),"resizable"===t&&(s=n.is(":data(ui-resizable)"),s&&!e&&n.resizable("destroy"),s&&"string"==typeof e&&n.resizable("option","handles",e),s||e===!1||this._makeResizable()),"title"===t&&this._title(this.uiDialogTitlebar.find(".ui-dialog-title")))},_size:function(){var t,e,i,s=this.options;this.element.show().css({width:"auto",minHeight:0,maxHeight:"none",height:0}),s.minWidth>s.width&&(s.width=s.minWidth),t=this.uiDialog.css({height:"auto",width:s.width}).outerHeight(),e=Math.max(0,s.minHeight-t),i="number"==typeof s.maxHeight?Math.max(0,s.maxHeight-t):"none","auto"===s.height?this.element.css({minHeight:e,maxHeight:i,height:"auto"}):this.element.height(Math.max(0,s.height-t)),this.uiDialog.is(":data(ui-resizable)")&&this.uiDialog.resizable("option","minHeight",this._minHeight())},_blockFrames:function(){this.iframeBlocks=this.document.find("iframe").map(function(){var e=t(this);return t("<div>").css({position:"absolute",width:e.outerWidth(),height:e.outerHeight()}).appendTo(e.parent()).offset(e.offset())[0]})},_unblockFrames:function(){this.iframeBlocks&&(this.iframeBlocks.remove(),delete this.iframeBlocks)},_allowInteraction:function(e){return t(e.target).closest(".ui-dialog").length?!0:!!t(e.target).closest(".ui-datepicker").length},
            _createOverlay:function(){
                if(this.options.modal){
                    var e=this,i=this.widgetFullName;
                    t.ui.dialog.overlayInstances||this._delay(function(){
                        t.ui.dialog.overlayInstances&&this.document.bind("focusin.dialog",function(s){
                            e._allowInteraction(s)||(s.preventDefault(),t(".ui-dialog:visible:last .ui-dialog-content").data(i)._focusTabbable())
                        })
                    }),this.overlay=t("<div>").addClass("ui-widget-overlay ui-front").appendTo(this._appendTo()),this._on(this.overlay,{mousedown:"_keepFocus"}),t.ui.dialog.overlayInstances++
                }
            }
            ,_destroyOverlay:function(){
            this.options.modal&&this.overlay&&(t.ui.dialog.overlayInstances--,t.ui.dialog.overlayInstances||this.document.unbind("focusin.dialog"),this.overlay.remove(),this.overlay=null)
        }
        }),t.ui.dialog.overlayInstances=0,t.uiBackCompat!==!1&&t.widget("ui.dialog",t.ui.dialog,{_position:function(){var e,i=this.options.position,s=[],n=[0,0];i?(("string"==typeof i||"object"==typeof i&&"0"in i)&&(s=i.split?i.split(" "):[i[0],i[1]],1===s.length&&(s[1]=s[0]),t.each(["left","top"],function(t,e){+s[t]===s[t]&&(n[t]=s[t],s[t]=e)}),i={my:s[0]+(0>n[0]?n[0]:"+"+n[0])+" "+s[1]+(0>n[1]?n[1]:"+"+n[1]),at:s.join(" ")}),i=t.extend({},t.ui.dialog.prototype.options.position,i)):i=t.ui.dialog.prototype.options.position,e=this.uiDialog.is(":visible"),e||this.uiDialog.show(),this.uiDialog.position(i),e||this.uiDialog.hide()}})}
(jQuery),function(t){t.widget("ui.menu",{version:"1.10.3",defaultElement:"<ul>",delay:300,options:{icons:{submenu:"ui-icon-carat-1-e"},menus:"ul",
    position:{my:"left top",at:"right top"},role:"menu",blur:null,focus:null,select:null},_create:function(){this.activeMenu=this.element,this.mouseHandled=!1,this.element.uniqueId().addClass("ui-menu ui-widget ui-widget-content ui-corner-all").toggleClass("ui-menu-icons",!!this.element.find(".ui-icon").length).attr({role:this.options.role,tabIndex:0}).bind("click"+this.eventNamespace,t.proxy(function(t){this.options.disabled&&t.preventDefault()},this)),this.options.disabled&&this.element.addClass("ui-state-disabled").attr("aria-disabled","true"),this._on({"mousedown .ui-menu-item > a":function(t){t.preventDefault()},"click .ui-state-disabled > a":function(t){t.preventDefault()},"click .ui-menu-item:has(a)":function(e){var i=t(e.target).closest(".ui-menu-item");!this.mouseHandled&&i.not(".ui-state-disabled").length&&(this.mouseHandled=!0,this.select(e),i.has(".ui-menu").length?this.expand(e):this.element.is(":focus")||(this.element.trigger("focus",[!0]),this.active&&1===this.active.parents(".ui-menu").length&&clearTimeout(this.timer)))},"mouseenter .ui-menu-item":function(e){var i=t(e.currentTarget);i.siblings().children(".ui-state-active").removeClass("ui-state-active"),this.focus(e,i)},mouseleave:"collapseAll","mouseleave .ui-menu":"collapseAll",focus:function(t,e){var i=this.active||this.element.children(".ui-menu-item").eq(0);e||this.focus(t,i)},blur:function(e){this._delay(function(){t.contains(this.element[0],this.document[0].activeElement)||this.collapseAll(e)})},keydown:"_keydown"}),this.refresh(),this._on(this.document,{click:function(e){t(e.target).closest(".ui-menu").length||this.collapseAll(e),this.mouseHandled=!1}})},_destroy:function(){this.element.removeAttr("aria-activedescendant").find(".ui-menu").addBack().removeClass("ui-menu ui-widget ui-widget-content ui-corner-all ui-menu-icons").removeAttr("role").removeAttr("tabIndex").removeAttr("aria-labelledby").removeAttr("aria-expanded").removeAttr("aria-hidden").removeAttr("aria-disabled").removeUniqueId().show(),this.element.find(".ui-menu-item").removeClass("ui-menu-item").removeAttr("role").removeAttr("aria-disabled").children("a").removeUniqueId().removeClass("ui-corner-all ui-state-hover").removeAttr("tabIndex").removeAttr("role").removeAttr("aria-haspopup").children().each(function(){var e=t(this);e.data("ui-menu-submenu-carat")&&e.remove()}),this.element.find(".ui-menu-divider").removeClass("ui-menu-divider ui-widget-content")},_keydown:function(e){function i(t){return t.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&")}var s,n,a,o,r,l=!0;switch(e.keyCode){case t.ui.keyCode.PAGE_UP:this.previousPage(e);break;case t.ui.keyCode.PAGE_DOWN:this.nextPage(e);break;case t.ui.keyCode.HOME:this._move("first","first",e);break;case t.ui.keyCode.END:this._move("last","last",e);break;case t.ui.keyCode.UP:this.previous(e);break;case t.ui.keyCode.DOWN:this.next(e);break;case t.ui.keyCode.LEFT:this.collapse(e);break;case t.ui.keyCode.RIGHT:this.active&&!this.active.is(".ui-state-disabled")&&this.expand(e);break;case t.ui.keyCode.ENTER:case t.ui.keyCode.SPACE:this._activate(e);break;case t.ui.keyCode.ESCAPE:this.collapse(e);break;default:l=!1,n=this.previousFilter||"",a=String.fromCharCode(e.keyCode),o=!1,clearTimeout(this.filterTimer),a===n?o=!0:a=n+a,r=RegExp("^"+i(a),"i"),s=this.activeMenu.children(".ui-menu-item").filter(function(){return r.test(t(this).children("a").text())}),s=o&&-1!==s.index(this.active.next())?this.active.nextAll(".ui-menu-item"):s,s.length||(a=String.fromCharCode(e.keyCode),r=RegExp("^"+i(a),"i"),s=this.activeMenu.children(".ui-menu-item").filter(function(){return r.test(t(this).children("a").text())})),s.length?(this.focus(e,s),s.length>1?(this.previousFilter=a,this.filterTimer=this._delay(function(){delete this.previousFilter},1e3)):delete this.previousFilter):delete this.previousFilter}l&&e.preventDefault()},_activate:function(t){this.active.is(".ui-state-disabled")||(this.active.children("a[aria-haspopup='true']").length?this.expand(t):this.select(t))},refresh:function(){var e,i=this.options.icons.submenu,s=this.element.find(this.options.menus);s.filter(":not(.ui-menu)").addClass("ui-menu ui-widget ui-widget-content ui-corner-all").hide().attr({role:this.options.role,"aria-hidden":"true","aria-expanded":"false"}).each(function(){var e=t(this),s=e.prev("a"),n=t("<span>").addClass("ui-menu-icon ui-icon "+i).data("ui-menu-submenu-carat",!0);s.attr("aria-haspopup","true").prepend(n),e.attr("aria-labelledby",s.attr("id"))}),e=s.add(this.element),e.children(":not(.ui-menu-item):has(a)").addClass("ui-menu-item").attr("role","presentation").children("a").uniqueId().addClass("ui-corner-all").attr({tabIndex:-1,role:this._itemRole()}),e.children(":not(.ui-menu-item)").each(function(){var e=t(this);/[^\-\u2014\u2013\s]/.test(e.text())||e.addClass("ui-widget-content ui-menu-divider")}),e.children(".ui-state-disabled").attr("aria-disabled","true"),this.active&&!t.contains(this.element[0],this.active[0])&&this.blur()},_itemRole:function(){return{menu:"menuitem",listbox:"option"}[this.options.role]},_setOption:function(t,e){"icons"===t&&this.element.find(".ui-menu-icon").removeClass(this.options.icons.submenu).addClass(e.submenu),this._super(t,e)},focus:function(t,e){var i,s;this.blur(t,t&&"focus"===t.type),this._scrollIntoView(e),this.active=e.first(),s=this.active.children("a").addClass("ui-state-focus"),this.options.role&&this.element.attr("aria-activedescendant",s.attr("id")),this.active.parent().closest(".ui-menu-item").children("a:first").addClass("ui-state-active"),t&&"keydown"===t.type?this._close():this.timer=this._delay(function(){this._close()},this.delay),i=e.children(".ui-menu"),i.length&&/^mouse/.test(t.type)&&this._startOpening(i),this.activeMenu=e.parent(),this._trigger("focus",t,{item:e})},_scrollIntoView:function(e){var i,s,n,a,o,r;this._hasScroll()&&(i=parseFloat(t.css(this.activeMenu[0],"borderTopWidth"))||0,s=parseFloat(t.css(this.activeMenu[0],"paddingTop"))||0,n=e.offset().top-this.activeMenu.offset().top-i-s,a=this.activeMenu.scrollTop(),o=this.activeMenu.height(),r=e.height(),0>n?this.activeMenu.scrollTop(a+n):n+r>o&&this.activeMenu.scrollTop(a+n-o+r))},blur:function(t,e){e||clearTimeout(this.timer),this.active&&(this.active.children("a").removeClass("ui-state-focus"),this.active=null,this._trigger("blur",t,{item:this.active}))},_startOpening:function(t){clearTimeout(this.timer),"true"===t.attr("aria-hidden")&&(this.timer=this._delay(function(){this._close(),this._open(t)},this.delay))},_open:function(e){var i=t.extend({of:this.active},this.options.position);clearTimeout(this.timer),this.element.find(".ui-menu").not(e.parents(".ui-menu")).hide().attr("aria-hidden","true"),e.show().removeAttr("aria-hidden").attr("aria-expanded","true").position(i)},collapseAll:function(e,i){clearTimeout(this.timer),this.timer=this._delay(function(){var s=i?this.element:t(e&&e.target).closest(this.element.find(".ui-menu"));s.length||(s=this.element),this._close(s),this.blur(e),this.activeMenu=s},this.delay)},_close:function(t){t||(t=this.active?this.active.parent():this.element),t.find(".ui-menu").hide().attr("aria-hidden","true").attr("aria-expanded","false").end().find("a.ui-state-active").removeClass("ui-state-active")},collapse:function(t){var e=this.active&&this.active.parent().closest(".ui-menu-item",this.element);e&&e.length&&(this._close(),this.focus(t,e))},expand:function(t){var e=this.active&&this.active.children(".ui-menu ").children(".ui-menu-item").first();e&&e.length&&(this._open(e.parent()),this._delay(function(){this.focus(t,e)}))},next:function(t){this._move("next","first",t)},previous:function(t){this._move("prev","last",t)},isFirstItem:function(){return this.active&&!this.active.prevAll(".ui-menu-item").length},isLastItem:function(){return this.active&&!this.active.nextAll(".ui-menu-item").length},_move:function(t,e,i){var s;this.active&&(s="first"===t||"last"===t?this.active["first"===t?"prevAll":"nextAll"](".ui-menu-item").eq(-1):this.active[t+"All"](".ui-menu-item").eq(0)),s&&s.length&&this.active||(s=this.activeMenu.children(".ui-menu-item")[e]()),this.focus(i,s)},nextPage:function(e){var i,s,n;return this.active?(this.isLastItem()||(this._hasScroll()?(s=this.active.offset().top,n=this.element.height(),this.active.nextAll(".ui-menu-item").each(function(){return i=t(this),0>i.offset().top-s-n}),this.focus(e,i)):this.focus(e,this.activeMenu.children(".ui-menu-item")[this.active?"last":"first"]())),void 0):(this.next(e),void 0)},previousPage:function(e){var i,s,n;return this.active?(this.isFirstItem()||(this._hasScroll()?(s=this.active.offset().top,n=this.element.height(),this.active.prevAll(".ui-menu-item").each(function(){return i=t(this),i.offset().top-s+n>0}),this.focus(e,i)):this.focus(e,this.activeMenu.children(".ui-menu-item").first())),void 0):(this.next(e),void 0)},_hasScroll:function(){return this.element.outerHeight()<this.element.prop("scrollHeight")},select:function(e){this.active=this.active||t(e.target).closest(".ui-menu-item");var i={item:this.active};this.active.has(".ui-menu").length||this.collapseAll(e,!0),this._trigger("select",e,i)}})}
(jQuery),function(t,e){t.widget("ui.progressbar",{version:"1.10.3",options:{max:100,value:0,change:null,complete:null},min:0,_create:function(){this.oldValue=this.options.value=this._constrainedValue(),this.element.addClass("ui-progressbar ui-widget ui-widget-content ui-corner-all").attr({role:"progressbar","aria-valuemin":this.min}),this.valueDiv=t("<div class='ui-progressbar-value ui-widget-header ui-corner-left'></div>").appendTo(this.element),this._refreshValue()},_destroy:function(){this.element.removeClass("ui-progressbar ui-widget ui-widget-content ui-corner-all").removeAttr("role").removeAttr("aria-valuemin").removeAttr("aria-valuemax").removeAttr("aria-valuenow"),this.valueDiv.remove()},value:function(t){return t===e?this.options.value:(this.options.value=this._constrainedValue(t),this._refreshValue(),e)},_constrainedValue:function(t){return t===e&&(t=this.options.value),this.indeterminate=t===!1,"number"!=typeof t&&(t=0),this.indeterminate?!1:Math.min(this.options.max,Math.max(this.min,t))},_setOptions:function(t){var e=t.value;delete t.value,this._super(t),this.options.value=this._constrainedValue(e),this._refreshValue()},_setOption:function(t,e){"max"===t&&(e=Math.max(this.min,e)),this._super(t,e)},_percentage:function(){return this.indeterminate?100:100*(this.options.value-this.min)/(this.options.max-this.min)},_refreshValue:function(){var e=this.options.value,i=this._percentage();this.valueDiv.toggle(this.indeterminate||e>this.min).toggleClass("ui-corner-right",e===this.options.max).width(i.toFixed(0)+"%"),this.element.toggleClass("ui-progressbar-indeterminate",this.indeterminate),this.indeterminate?(this.element.removeAttr("aria-valuenow"),this.overlayDiv||(this.overlayDiv=t("<div class='ui-progressbar-overlay'></div>").appendTo(this.valueDiv))):(this.element.attr({"aria-valuemax":this.options.max,"aria-valuenow":e}),this.overlayDiv&&(this.overlayDiv.remove(),this.overlayDiv=null)),this.oldValue!==e&&(this.oldValue=e,this._trigger("change")),e===this.options.max&&this._trigger("complete")}})}
(jQuery),function(t){var e=5;t.widget("ui.slider",t.ui.mouse,{version:"1.10.3",widgetEventPrefix:"slide",options:{animate:!1,distance:0,max:100,min:0,orientation:"horizontal",range:!1,step:1,value:0,values:null,change:null,slide:null,start:null,stop:null},_create:function(){this._keySliding=!1,this._mouseSliding=!1,this._animateOff=!0,this._handleIndex=null,this._detectOrientation(),this._mouseInit(),this.element.addClass("ui-slider ui-slider-"+this.orientation+" ui-widget ui-widget-content ui-corner-all"),this._refresh(),this._setOption("disabled",this.options.disabled),this._animateOff=!1},_refresh:function(){this._createRange(),this._createHandles(),this._setupEvents(),this._refreshValue()},_createHandles:function(){var e,i,s=this.options,n=this.element.find(".ui-slider-handle").addClass("ui-state-default ui-corner-all"),a="<a class='ui-slider-handle ui-state-default ui-corner-all' href='#'></a>",o=[];for(i=s.values&&s.values.length||1,n.length>i&&(n.slice(i).remove(),n=n.slice(0,i)),e=n.length;i>e;e++)o.push(a);this.handles=n.add(t(o.join("")).appendTo(this.element)),this.handle=this.handles.eq(0),this.handles.each(function(e){t(this).data("ui-slider-handle-index",e)})},_createRange:function(){var e=this.options,i="";e.range?(e.range===!0&&(e.values?e.values.length&&2!==e.values.length?e.values=[e.values[0],e.values[0]]:t.isArray(e.values)&&(e.values=e.values.slice(0)):e.values=[this._valueMin(),this._valueMin()]),this.range&&this.range.length?this.range.removeClass("ui-slider-range-min ui-slider-range-max").css({left:"",bottom:""}):(this.range=t("<div></div>").appendTo(this.element),i="ui-slider-range ui-widget-header ui-corner-all"),this.range.addClass(i+("min"===e.range||"max"===e.range?" ui-slider-range-"+e.range:""))):this.range=t([])},_setupEvents:function(){var t=this.handles.add(this.range).filter("a");this._off(t),this._on(t,this._handleEvents),this._hoverable(t),this._focusable(t)},_destroy:function(){this.handles.remove(),this.range.remove(),this.element.removeClass("ui-slider ui-slider-horizontal ui-slider-vertical ui-widget ui-widget-content ui-corner-all"),this._mouseDestroy()},_mouseCapture:function(e){var i,s,n,a,o,r,l,h,c=this,u=this.options;return u.disabled?!1:(this.elementSize={width:this.element.outerWidth(),height:this.element.outerHeight()},this.elementOffset=this.element.offset(),i={x:e.pageX,y:e.pageY},s=this._normValueFromMouse(i),n=this._valueMax()-this._valueMin()+1,this.handles.each(function(e){var i=Math.abs(s-c.values(e));(n>i||n===i&&(e===c._lastChangedValue||c.values(e)===u.min))&&(n=i,a=t(this),o=e)}),r=this._start(e,o),r===!1?!1:(this._mouseSliding=!0,this._handleIndex=o,a.addClass("ui-state-active").focus(),l=a.offset(),h=!t(e.target).parents().addBack().is(".ui-slider-handle"),this._clickOffset=h?{left:0,top:0}:{left:e.pageX-l.left-a.width()/2,top:e.pageY-l.top-a.height()/2-(parseInt(a.css("borderTopWidth"),10)||0)-(parseInt(a.css("borderBottomWidth"),10)||0)+(parseInt(a.css("marginTop"),10)||0)},this.handles.hasClass("ui-state-hover")||this._slide(e,o,s),this._animateOff=!0,!0))},_mouseStart:function(){return!0},_mouseDrag:function(t){var e={x:t.pageX,y:t.pageY},i=this._normValueFromMouse(e);return this._slide(t,this._handleIndex,i),!1},_mouseStop:function(t){return this.handles.removeClass("ui-state-active"),this._mouseSliding=!1,this._stop(t,this._handleIndex),this._change(t,this._handleIndex),this._handleIndex=null,this._clickOffset=null,this._animateOff=!1,!1},_detectOrientation:function(){this.orientation="vertical"===this.options.orientation?"vertical":"horizontal"},_normValueFromMouse:function(t){var e,i,s,n,a;return"horizontal"===this.orientation?(e=this.elementSize.width,i=t.x-this.elementOffset.left-(this._clickOffset?this._clickOffset.left:0)):(e=this.elementSize.height,i=t.y-this.elementOffset.top-(this._clickOffset?this._clickOffset.top:0)),s=i/e,s>1&&(s=1),0>s&&(s=0),"vertical"===this.orientation&&(s=1-s),n=this._valueMax()-this._valueMin(),a=this._valueMin()+s*n,this._trimAlignValue(a)

},
    _start:function(t,e){var i={handle:this.handles[e],value:this.value()};return this.options.values&&this.options.values.length&&(i.value=this.values(e),i.values=this.values()),this._trigger("start",t,i)},_slide:function(t,e,i){var s,n,a;this.options.values&&this.options.values.length?(s=this.values(e?0:1),2===this.options.values.length&&this.options.range===!0&&(0===e&&i>s||1===e&&s>i)&&(i=s),i!==this.values(e)&&(n=this.values(),n[e]=i,a=this._trigger("slide",t,{handle:this.handles[e],value:i,values:n}),s=this.values(e?0:1),a!==!1&&this.values(e,i,!0))):i!==this.value()&&(a=this._trigger("slide",t,{handle:this.handles[e],value:i}),a!==!1&&this.value(i))},_stop:function(t,e){var i={handle:this.handles[e],value:this.value()};this.options.values&&this.options.values.length&&(i.value=this.values(e),i.values=this.values()),this._trigger("stop",t,i)},_change:function(t,e){if(!this._keySliding&&!this._mouseSliding){var i={handle:this.handles[e],value:this.value()};this.options.values&&this.options.values.length&&(i.value=this.values(e),i.values=this.values()),this._lastChangedValue=e,this._trigger("change",t,i)}},value:function(t){return arguments.length?(this.options.value=this._trimAlignValue(t),this._refreshValue(),this._change(null,0),void 0):this._value()},values:function(e,i){var s,n,a;if(arguments.length>1)return this.options.values[e]=this._trimAlignValue(i),this._refreshValue(),this._change(null,e),void 0;if(!arguments.length)return this._values();if(!t.isArray(arguments[0]))return this.options.values&&this.options.values.length?this._values(e):this.value();for(s=this.options.values,n=arguments[0],a=0;s.length>a;a+=1)s[a]=this._trimAlignValue(n[a]),this._change(null,a);this._refreshValue()},
    _setOption:function(e,i){var s,n=0;switch("range"===e&&this.options.range===!0&&("min"===i?(this.options.value=this._values(0),this.options.values=null):"max"===i&&(this.options.value=this._values(this.options.values.length-1),this.options.values=null)),t.isArray(this.options.values)&&(n=this.options.values.length),t.Widget.prototype._setOption.apply(this,arguments),e){case"orientation":this._detectOrientation(),this.element.removeClass("ui-slider-horizontal ui-slider-vertical").addClass("ui-slider-"+this.orientation),this._refreshValue();break;case"value":this._animateOff=!0,this._refreshValue(),this._change(null,0),this._animateOff=!1;break;case"values":for(this._animateOff=!0,this._refreshValue(),s=0;n>s;s+=1)this._change(null,s);this._animateOff=!1;break;case"min":case"max":this._animateOff=!0,this._refreshValue(),this._animateOff=!1;break;case"range":this._animateOff=!0,this._refresh(),this._animateOff=!1}},_value:function(){var t=this.options.value;return t=this._trimAlignValue(t)},_values:function(t){var e,i,s;if(arguments.length)return e=this.options.values[t],e=this._trimAlignValue(e);if(this.options.values&&this.options.values.length){for(i=this.options.values.slice(),s=0;i.length>s;s+=1)i[s]=this._trimAlignValue(i[s]);return i}return[]},_trimAlignValue:function(t){if(this._valueMin()>=t)return this._valueMin();if(t>=this._valueMax())return this._valueMax();var e=this.options.step>0?this.options.step:1,i=(t-this._valueMin())%e,s=t-i;return 2*Math.abs(i)>=e&&(s+=i>0?e:-e),parseFloat(s.toFixed(5))},_valueMin:function(){return this.options.min},_valueMax:function(){return this.options.max},_refreshValue:function(){var e,i,s,n,a,o=this.options.range,r=this.options,l=this,h=this._animateOff?!1:r.animate,c={};this.options.values&&this.options.values.length?this.handles.each(function(s){i=100*((l.values(s)-l._valueMin())/(l._valueMax()-l._valueMin())),c["horizontal"===l.orientation?"left":"bottom"]=i+"%",t(this).stop(1,1)[h?"animate":"css"](c,r.animate),l.options.range===!0&&("horizontal"===l.orientation?(0===s&&l.range.stop(1,1)[h?"animate":"css"]({left:i+"%"},r.animate),1===s&&l.range[h?"animate":"css"]({width:i-e+"%"},{queue:!1,duration:r.animate})):(0===s&&l.range.stop(1,1)[h?"animate":"css"]({bottom:i+"%"},r.animate),1===s&&l.range[h?"animate":"css"]({height:i-e+"%"},{queue:!1,duration:r.animate}))),e=i}):(s=this.value(),n=this._valueMin(),a=this._valueMax(),i=a!==n?100*((s-n)/(a-n)):0,c["horizontal"===this.orientation?"left":"bottom"]=i+"%",this.handle.stop(1,1)[h?"animate":"css"](c,r.animate),"min"===o&&"horizontal"===this.orientation&&this.range.stop(1,1)[h?"animate":"css"]({width:i+"%"},r.animate),"max"===o&&"horizontal"===this.orientation&&this.range[h?"animate":"css"]({width:100-i+"%"},{queue:!1,duration:r.animate}),"min"===o&&"vertical"===this.orientation&&this.range.stop(1,1)[h?"animate":"css"]({height:i+"%"},r.animate),"max"===o&&"vertical"===this.orientation&&this.range[h?"animate":"css"]({height:100-i+"%"},{queue:!1,duration:r.animate}))},_handleEvents:{keydown:function(i){var s,n,a,o,r=t(i.target).data("ui-slider-handle-index");switch(i.keyCode){case t.ui.keyCode.HOME:case t.ui.keyCode.END:case t.ui.keyCode.PAGE_UP:case t.ui.keyCode.PAGE_DOWN:case t.ui.keyCode.UP:case t.ui.keyCode.RIGHT:case t.ui.keyCode.DOWN:case t.ui.keyCode.LEFT:if(i.preventDefault(),!this._keySliding&&(this._keySliding=!0,t(i.target).addClass("ui-state-active"),s=this._start(i,r),s===!1))return}switch(o=this.options.step,n=a=this.options.values&&this.options.values.length?this.values(r):this.value(),i.keyCode){case t.ui.keyCode.HOME:a=this._valueMin();break;case t.ui.keyCode.END:a=this._valueMax();break;case t.ui.keyCode.PAGE_UP:a=this._trimAlignValue(n+(this._valueMax()-this._valueMin())/e);break;case t.ui.keyCode.PAGE_DOWN:a=this._trimAlignValue(n-(this._valueMax()-this._valueMin())/e);break;case t.ui.keyCode.UP:case t.ui.keyCode.RIGHT:if(n===this._valueMax())return;a=this._trimAlignValue(n+o);break;case t.ui.keyCode.DOWN:case t.ui.keyCode.LEFT:if(n===this._valueMin())return;a=this._trimAlignValue(n-o)}this._slide(i,r,a)},click:function(t){t.preventDefault()},keyup:function(e){var i=t(e.target).data("ui-slider-handle-index");this._keySliding&&(this._keySliding=!1,this._stop(e,i),this._change(e,i),t(e.target).removeClass("ui-state-active"))}}})}
(jQuery),function(t){function e(t){return function(){var e=this.element.val();t.apply(this,arguments),this._refresh(),e!==this.element.val()&&this._trigger("change")}}t.widget("ui.spinner",{version:"1.10.3",defaultElement:"<input>",widgetEventPrefix:"spin",options:{culture:null,icons:{down:"ui-icon-triangle-1-s",up:"ui-icon-triangle-1-n"},incremental:!0,max:null,min:null,numberFormat:null,page:10,step:1,change:null,spin:null,start:null,stop:null},_create:function(){this._setOption("max",this.options.max),this._setOption("min",this.options.min),this._setOption("step",this.options.step),this._value(this.element.val(),!0),this._draw(),this._on(this._events),this._refresh(),this._on(this.window,{beforeunload:function(){this.element.removeAttr("autocomplete")}})},_getCreateOptions:function(){var e={},i=this.element;return t.each(["min","max","step"],function(t,s){var n=i.attr(s);void 0!==n&&n.length&&(e[s]=n)}),e},_events:{keydown:function(t){this._start(t)&&this._keydown(t)&&t.preventDefault()},keyup:"_stop",focus:function(){this.previous=this.element.val()},blur:function(t){return this.cancelBlur?(delete this.cancelBlur,void 0):(this._stop(),this._refresh(),this.previous!==this.element.val()&&this._trigger("change",t),void 0)},mousewheel:function(t,e){if(e){if(!this.spinning&&!this._start(t))return!1;this._spin((e>0?1:-1)*this.options.step,t),clearTimeout(this.mousewheelTimer),this.mousewheelTimer=this._delay(function(){this.spinning&&this._stop(t)},100),t.preventDefault()}},"mousedown .ui-spinner-button":function(e){function i(){var t=this.element[0]===this.document[0].activeElement;t||(this.element.focus(),this.previous=s,this._delay(function(){this.previous=s}))}var s;s=this.element[0]===this.document[0].activeElement?this.previous:this.element.val(),e.preventDefault(),i.call(this),this.cancelBlur=!0,this._delay(function(){delete this.cancelBlur,i.call(this)}),this._start(e)!==!1&&this._repeat(null,t(e.currentTarget).hasClass("ui-spinner-up")?1:-1,e)},"mouseup .ui-spinner-button":"_stop","mouseenter .ui-spinner-button":function(e){return t(e.currentTarget).hasClass("ui-state-active")?this._start(e)===!1?!1:(this._repeat(null,t(e.currentTarget).hasClass("ui-spinner-up")?1:-1,e),void 0):void 0},"mouseleave .ui-spinner-button":"_stop"},_draw:function(){var t=this.uiSpinner=this.element.addClass("ui-spinner-input").attr("autocomplete","off").wrap(this._uiSpinnerHtml()).parent().append(this._buttonHtml());this.element.attr("role","spinbutton"),this.buttons=t.find(".ui-spinner-button").attr("tabIndex",-1).button().removeClass("ui-corner-all"),this.buttons.height()>Math.ceil(.5*t.height())&&t.height()>0&&t.height(t.height()),this.options.disabled&&this.disable()},_keydown:function(e){var i=this.options,s=t.ui.keyCode;switch(e.keyCode){case s.UP:return this._repeat(null,1,e),!0;case s.DOWN:return this._repeat(null,-1,e),!0;case s.PAGE_UP:return this._repeat(null,i.page,e),!0;case s.PAGE_DOWN:return this._repeat(null,-i.page,e),!0}return!1},_uiSpinnerHtml:function(){return"<span class='ui-spinner ui-widget ui-widget-content ui-corner-all'></span>"},_buttonHtml:function(){return"<a class='ui-spinner-button ui-spinner-up ui-corner-tr'><span class='ui-icon "+this.options.icons.up+"'>&#9650;</span></a><a class='ui-spinner-button ui-spinner-down ui-corner-br'><span class='ui-icon "+this.options.icons.down+"'>&#9660;</span></a>"},_start:function(t){return this.spinning||this._trigger("start",t)!==!1?(this.counter||(this.counter=1),this.spinning=!0,!0):!1},_repeat:function(t,e,i){t=t||500,clearTimeout(this.timer),this.timer=this._delay(function(){this._repeat(40,e,i)},t),this._spin(e*this.options.step,i)},_spin:function(t,e){var i=this.value()||0;this.counter||(this.counter=1),i=this._adjustValue(i+t*this._increment(this.counter)),this.spinning&&this._trigger("spin",e,{value:i})===!1||(this._value(i),this.counter++)},_increment:function(e){var i=this.options.incremental;return i?t.isFunction(i)?i(e):Math.floor(e*e*e/5e4-e*e/500+17*e/200+1):1},_precision:function(){var t=this._precisionOf(this.options.step);return null!==this.options.min&&(t=Math.max(t,this._precisionOf(this.options.min))),t},_precisionOf:function(t){var e=""+t,i=e.indexOf(".");return-1===i?0:e.length-i-1},_adjustValue:function(t){var e,i,s=this.options;return e=null!==s.min?s.min:0,i=t-e,i=Math.round(i/s.step)*s.step,t=e+i,t=parseFloat(t.toFixed(this._precision())),null!==s.max&&t>s.max?s.max:null!==s.min&&s.min>t?s.min:t},_stop:function(t){this.spinning&&(clearTimeout(this.timer),clearTimeout(this.mousewheelTimer),this.counter=0,this.spinning=!1,this._trigger("stop",t))},_setOption:function(t,e){if("culture"===t||"numberFormat"===t){var i=this._parse(this.element.val());return this.options[t]=e,this.element.val(this._format(i)),void 0}("max"===t||"min"===t||"step"===t)&&"string"==typeof e&&(e=this._parse(e)),"icons"===t&&(this.buttons.first().find(".ui-icon").removeClass(this.options.icons.up).addClass(e.up),this.buttons.last().find(".ui-icon").removeClass(this.options.icons.down).addClass(e.down)),this._super(t,e),"disabled"===t&&(e?(this.element.prop("disabled",!0),this.buttons.button("disable")):(this.element.prop("disabled",!1),this.buttons.button("enable")))},_setOptions:e(function(t){this._super(t),this._value(this.element.val())}),_parse:function(t){return"string"==typeof t&&""!==t&&(t=window.Globalize&&this.options.numberFormat?Globalize.parseFloat(t,10,this.options.culture):+t),""===t||isNaN(t)?null:t},_format:function(t){return""===t?"":window.Globalize&&this.options.numberFormat?Globalize.format(t,this.options.numberFormat,this.options.culture):t},_refresh:function(){this.element.attr({"aria-valuemin":this.options.min,"aria-valuemax":this.options.max,"aria-valuenow":this._parse(this.element.val())})},_value:function(t,e){var i;""!==t&&(i=this._parse(t),null!==i&&(e||(i=this._adjustValue(i)),t=this._format(i))),this.element.val(t),this._refresh()},_destroy:function(){this.element.removeClass("ui-spinner-input").prop("disabled",!1).removeAttr("autocomplete").removeAttr("role").removeAttr("aria-valuemin").removeAttr("aria-valuemax").removeAttr("aria-valuenow"),this.uiSpinner.replaceWith(this.element)},stepUp:e(function(t){this._stepUp(t)}),_stepUp:function(t){this._start()&&(this._spin((t||1)*this.options.step),this._stop())},stepDown:e(function(t){this._stepDown(t)}),_stepDown:function(t){this._start()&&(this._spin((t||1)*-this.options.step),this._stop())},pageUp:e(function(t){this._stepUp((t||1)*this.options.page)}),pageDown:e(function(t){this._stepDown((t||1)*this.options.page)}),value:function(t){return arguments.length?(e(this._value).call(this,t),void 0):this._parse(this.element.val())},widget:function(){return this.uiSpinner}})}
(jQuery),function(t,e){function i(){return++n}function s(t){return t.hash.length>1&&decodeURIComponent(t.href.replace(a,""))===decodeURIComponent(location.href.replace(a,""))}var n=0,a=/#.*$/;t.widget("ui.tabs",{version:"1.10.3",delay:300,options:{active:null,collapsible:!1,event:"click",heightStyle:"content",hide:null,show:null,activate:null,beforeActivate:null,beforeLoad:null,load:null},_create:function(){var e=this,i=this.options;this.running=!1,this.element.addClass("ui-tabs ui-widget ui-widget-content ui-corner-all").toggleClass("ui-tabs-collapsible",i.collapsible).delegate(".ui-tabs-nav > li","mousedown"+this.eventNamespace,function(e){t(this).is(".ui-state-disabled")&&e.preventDefault()}).delegate(".ui-tabs-anchor","focus"+this.eventNamespace,function(){t(this).closest("li").is(".ui-state-disabled")&&this.blur()}),this._processTabs(),i.active=this._initialActive(),t.isArray(i.disabled)&&(i.disabled=t.unique(i.disabled.concat(t.map(this.tabs.filter(".ui-state-disabled"),function(t){return e.tabs.index(t)}))).sort()),this.active=this.options.active!==!1&&this.anchors.length?this._findActive(i.active):t(),this._refresh(),this.active.length&&this.load(i.active)},_initialActive:function(){var i=this.options.active,s=this.options.collapsible,n=location.hash.substring(1);return null===i&&(n&&this.tabs.each(function(s,a){return t(a).attr("aria-controls")===n?(i=s,!1):e}),null===i&&(i=this.tabs.index(this.tabs.filter(".ui-tabs-active"))),(null===i||-1===i)&&(i=this.tabs.length?0:!1)),i!==!1&&(i=this.tabs.index(this.tabs.eq(i)),-1===i&&(i=s?!1:0)),!s&&i===!1&&this.anchors.length&&(i=0),i},_getCreateEventData:function(){return{tab:this.active,panel:this.active.length?this._getPanelForTab(this.active):t()}},_tabKeydown:function(i){var s=t(this.document[0].activeElement).closest("li"),n=this.tabs.index(s),a=!0;if(!this._handlePageNav(i)){switch(i.keyCode){case t.ui.keyCode.RIGHT:case t.ui.keyCode.DOWN:n++;break;case t.ui.keyCode.UP:case t.ui.keyCode.LEFT:a=!1,n--;break;case t.ui.keyCode.END:n=this.anchors.length-1;break;case t.ui.keyCode.HOME:n=0;break;case t.ui.keyCode.SPACE:return i.preventDefault(),clearTimeout(this.activating),this._activate(n),e;case t.ui.keyCode.ENTER:return i.preventDefault(),clearTimeout(this.activating),this._activate(n===this.options.active?!1:n),e;default:return}i.preventDefault(),clearTimeout(this.activating),n=this._focusNextTab(n,a),i.ctrlKey||(s.attr("aria-selected","false"),this.tabs.eq(n).attr("aria-selected","true"),this.activating=this._delay(function(){this.option("active",n)},this.delay))}},_panelKeydown:function(e){this._handlePageNav(e)||e.ctrlKey&&e.keyCode===t.ui.keyCode.UP&&(e.preventDefault(),this.active.focus())},_handlePageNav:function(i){return i.altKey&&i.keyCode===t.ui.keyCode.PAGE_UP?(this._activate(this._focusNextTab(this.options.active-1,!1)),!0):i.altKey&&i.keyCode===t.ui.keyCode.PAGE_DOWN?(this._activate(this._focusNextTab(this.options.active+1,!0)),!0):e},_findNextTab:function(e,i){function s(){return e>n&&(e=0),0>e&&(e=n),e}for(var n=this.tabs.length-1;-1!==t.inArray(s(),this.options.disabled);)e=i?e+1:e-1;return e},_focusNextTab:function(t,e){return t=this._findNextTab(t,e),this.tabs.eq(t).focus(),t},_setOption:function(t,i){return"active"===t?(this._activate(i),e):"disabled"===t?(this._setupDisabled(i),e):(this._super(t,i),"collapsible"===t&&(this.element.toggleClass("ui-tabs-collapsible",i),i||this.options.active!==!1||this._activate(0)),"event"===t&&this._setupEvents(i),"heightStyle"===t&&this._setupHeightStyle(i),e)},_tabId:function(t){return t.attr("aria-controls")||"ui-tabs-"+i()},_sanitizeSelector:function(t){return t?t.replace(/[!"$%&'()*+,.\/:;<=>?@\[\]\^`{|}~]/g,"\\$&"):""},refresh:function(){var e=this.options,i=this.tablist.children(":has(a[href])");e.disabled=t.map(i.filter(".ui-state-disabled"),function(t){return i.index(t)}),this._processTabs(),e.active!==!1&&this.anchors.length?this.active.length&&!t.contains(this.tablist[0],this.active[0])?this.tabs.length===e.disabled.length?(e.active=!1,this.active=t()):this._activate(this._findNextTab(Math.max(0,e.active-1),!1)):e.active=this.tabs.index(this.active):(e.active=!1,this.active=t()),this._refresh()},_refresh:function(){this._setupDisabled(this.options.disabled),this._setupEvents(this.options.event),this._setupHeightStyle(this.options.heightStyle),this.tabs.not(this.active).attr({"aria-selected":"false",tabIndex:-1}),this.panels.not(this._getPanelForTab(this.active)).hide().attr({"aria-expanded":"false","aria-hidden":"true"}),this.active.length?(this.active.addClass("ui-tabs-active ui-state-active").attr({"aria-selected":"true",tabIndex:0}),this._getPanelForTab(this.active).show().attr({"aria-expanded":"true","aria-hidden":"false"})):this.tabs.eq(0).attr("tabIndex",0)},_processTabs:function(){var e=this;this.tablist=this._getList().addClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all").attr("role","tablist"),this.tabs=this.tablist.find("> li:has(a[href])").addClass("ui-state-default ui-corner-top").attr({role:"tab",tabIndex:-1}),this.anchors=this.tabs.map(function(){return t("a",this)[0]}).addClass("ui-tabs-anchor").attr({role:"presentation",tabIndex:-1}),this.panels=t(),this.anchors.each(function(i,n){var a,o,r,l=t(n).uniqueId().attr("id"),h=t(n).closest("li"),c=h.attr("aria-controls");s(n)?(a=n.hash,o=e.element.find(e._sanitizeSelector(a))):(r=e._tabId(h),a="#"+r,o=e.element.find(a),o.length||(o=e._createPanel(r),o.insertAfter(e.panels[i-1]||e.tablist)),o.attr("aria-live","polite")),o.length&&(e.panels=e.panels.add(o)),c&&h.data("ui-tabs-aria-controls",c),h.attr({"aria-controls":a.substring(1),"aria-labelledby":l}),o.attr("aria-labelledby",l)}),this.panels.addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").attr("role","tabpanel")},_getList:function(){return this.element.find("ol,ul").eq(0)},_createPanel:function(e){return t("<div>").attr("id",e).addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").data("ui-tabs-destroy",!0)},_setupDisabled:function(e){t.isArray(e)&&(e.length?e.length===this.anchors.length&&(e=!0):e=!1);for(var i,s=0;i=this.tabs[s];s++)e===!0||-1!==t.inArray(s,e)?t(i).addClass("ui-state-disabled").attr("aria-disabled","true"):t(i).removeClass("ui-state-disabled").removeAttr("aria-disabled");this.options.disabled=e},_setupEvents:function(e){var i={click:function(t){t.preventDefault()}};e&&t.each(e.split(" "),function(t,e){i[e]="_eventHandler"}),this._off(this.anchors.add(this.tabs).add(this.panels)),this._on(this.anchors,i),this._on(this.tabs,{keydown:"_tabKeydown"}),this._on(this.panels,{keydown:"_panelKeydown"}),this._focusable(this.tabs),this._hoverable(this.tabs)},_setupHeightStyle:function(e){var i,s=this.element.parent();"fill"===e?(i=s.height(),i-=this.element.outerHeight()-this.element.height(),this.element.siblings(":visible").each(function(){var e=t(this),s=e.css("position");"absolute"!==s&&"fixed"!==s&&(i-=e.outerHeight(!0))}),this.element.children().not(this.panels).each(function(){i-=t(this).outerHeight(!0)}),this.panels.each(function(){t(this).height(Math.max(0,i-t(this).innerHeight()+t(this).height()))}).css("overflow","auto")):"auto"===e&&(i=0,this.panels.each(function(){i=Math.max(i,t(this).height("").height())}).height(i))},_eventHandler:function(e){var i=this.options,s=this.active,n=t(e.currentTarget),a=n.closest("li"),o=a[0]===s[0],r=o&&i.collapsible,l=r?t():this._getPanelForTab(a),h=s.length?this._getPanelForTab(s):t(),c={oldTab:s,oldPanel:h,newTab:r?t():a,newPanel:l};e.preventDefault(),a.hasClass("ui-state-disabled")||a.hasClass("ui-tabs-loading")||this.running||o&&!i.collapsible||this._trigger("beforeActivate",e,c)===!1||(i.active=r?!1:this.tabs.index(a),this.active=o?t():a,this.xhr&&this.xhr.abort(),h.length||l.length||t.error("jQuery UI Tabs: Mismatching fragment identifier."),l.length&&this.load(this.tabs.index(a),e),this._toggle(e,c))},_toggle:function(e,i){function s(){a.running=!1,a._trigger("activate",e,i)}function n(){i.newTab.closest("li").addClass("ui-tabs-active ui-state-active"),o.length&&a.options.show?a._show(o,a.options.show,s):(o.show(),s())}var a=this,o=i.newPanel,r=i.oldPanel;this.running=!0,r.length&&this.options.hide?this._hide(r,this.options.hide,function(){i.oldTab.closest("li").removeClass("ui-tabs-active ui-state-active"),n()}):(i.oldTab.closest("li").removeClass("ui-tabs-active ui-state-active"),r.hide(),n()),r.attr({"aria-expanded":"false","aria-hidden":"true"}),i.oldTab.attr("aria-selected","false"),o.length&&r.length?i.oldTab.attr("tabIndex",-1):o.length&&this.tabs.filter(function(){return 0===t(this).attr("tabIndex")}).attr("tabIndex",-1),o.attr({"aria-expanded":"true","aria-hidden":"false"}),i.newTab.attr({"aria-selected":"true",tabIndex:0})},_activate:function(e){var i,s=this._findActive(e);s[0]!==this.active[0]&&(s.length||(s=this.active),i=s.find(".ui-tabs-anchor")[0],this._eventHandler({target:i,currentTarget:i,preventDefault:t.noop}))},_findActive:function(e){return e===!1?t():this.tabs.eq(e)},_getIndex:function(t){return"string"==typeof t&&(t=this.anchors.index(this.anchors.filter("[href$='"+t+"']"))),t},_destroy:function(){this.xhr&&this.xhr.abort(),this.element.removeClass("ui-tabs ui-widget ui-widget-content ui-corner-all ui-tabs-collapsible"),this.tablist.removeClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all").removeAttr("role"),this.anchors.removeClass("ui-tabs-anchor").removeAttr("role").removeAttr("tabIndex").removeUniqueId(),this.tabs.add(this.panels).each(function(){t.data(this,"ui-tabs-destroy")?t(this).remove():t(this).removeClass("ui-state-default ui-state-active ui-state-disabled ui-corner-top ui-corner-bottom ui-widget-content ui-tabs-active ui-tabs-panel").removeAttr("tabIndex").removeAttr("aria-live").removeAttr("aria-busy").removeAttr("aria-selected").removeAttr("aria-labelledby").removeAttr("aria-hidden").removeAttr("aria-expanded").removeAttr("role")}),this.tabs.each(function(){var e=t(this),i=e.data("ui-tabs-aria-controls");i?e.attr("aria-controls",i).removeData("ui-tabs-aria-controls"):e.removeAttr("aria-controls")}),this.panels.show(),"content"!==this.options.heightStyle&&this.panels.css("height","")},enable:function(i){var s=this.options.disabled;s!==!1&&(i===e?s=!1:(i=this._getIndex(i),s=t.isArray(s)?t.map(s,function(t){return t!==i?t:null}):t.map(this.tabs,function(t,e){return e!==i?e:null})),this._setupDisabled(s))},disable:function(i){var s=this.options.disabled;if(s!==!0){if(i===e)s=!0;else{if(i=this._getIndex(i),-1!==t.inArray(i,s))return;s=t.isArray(s)?t.merge([i],s).sort():[i]}this._setupDisabled(s)}},load:function(e,i){e=this._getIndex(e);var n=this,a=this.tabs.eq(e),o=a.find(".ui-tabs-anchor"),r=this._getPanelForTab(a),l={tab:a,panel:r};s(o[0])||(this.xhr=t.ajax(this._ajaxSettings(o,i,l)),this.xhr&&"canceled"!==this.xhr.statusText&&(a.addClass("ui-tabs-loading"),r.attr("aria-busy","true"),this.xhr.success(function(t){setTimeout(function(){r.html(t),n._trigger("load",i,l)},1)}).complete(function(t,e){setTimeout(function(){"abort"===e&&n.panels.stop(!1,!0),a.removeClass("ui-tabs-loading"),r.removeAttr("aria-busy"),t===n.xhr&&delete n.xhr},1)})))},_ajaxSettings:function(e,i,s){var n=this;return{url:e.attr("href"),beforeSend:function(e,a){return n._trigger("beforeLoad",i,t.extend({jqXHR:e,ajaxSettings:a},s))}}},_getPanelForTab:function(e){var i=t(e).attr("aria-controls");return this.element.find(this._sanitizeSelector("#"+i))}})}
(jQuery),function(t){function e(e,i){var s=(e.attr("aria-describedby")||"").split(/\s+/);s.push(i),e.data("ui-tooltip-id",i).attr("aria-describedby",t.trim(s.join(" ")))}function i(e){var i=e.data("ui-tooltip-id"),s=(e.attr("aria-describedby")||"").split(/\s+/),n=t.inArray(i,s);-1!==n&&s.splice(n,1),e.removeData("ui-tooltip-id"),s=t.trim(s.join(" ")),s?e.attr("aria-describedby",s):e.removeAttr("aria-describedby")}var s=0;t.widget("ui.tooltip",{version:"1.10.3",options:{content:function(){var e=t(this).attr("title")||"";return t("<a>").text(e).html()},hide:!0,items:"[title]:not([disabled])",position:{my:"left top+15",at:"left bottom",collision:"flipfit flip"},show:!0,tooltipClass:null,track:!1,close:null,open:null},_create:function(){this._on({mouseover:"open",focusin:"open"}),this.tooltips={},this.parents={},this.options.disabled&&this._disable()},_setOption:function(e,i){var s=this;return"disabled"===e?(this[i?"_disable":"_enable"](),this.options[e]=i,void 0):(this._super(e,i),"content"===e&&t.each(this.tooltips,function(t,e){s._updateContent(e)}),void 0)},_disable:function(){var e=this;t.each(this.tooltips,function(i,s){var n=t.Event("blur");n.target=n.currentTarget=s[0],e.close(n,!0)}),this.element.find(this.options.items).addBack().each(function(){var e=t(this);e.is("[title]")&&e.data("ui-tooltip-title",e.attr("title")).attr("title","")})},_enable:function(){this.element.find(this.options.items).addBack().each(function(){var e=t(this);e.data("ui-tooltip-title")&&e.attr("title",e.data("ui-tooltip-title"))})},open:function(e){var i=this,s=t(e?e.target:this.element).closest(this.options.items);s.length&&!s.data("ui-tooltip-id")&&(s.attr("title")&&s.data("ui-tooltip-title",s.attr("title")),s.data("ui-tooltip-open",!0),e&&"mouseover"===e.type&&s.parents().each(function(){var e,s=t(this);s.data("ui-tooltip-open")&&(e=t.Event("blur"),e.target=e.currentTarget=this,i.close(e,!0)),s.attr("title")&&(s.uniqueId(),i.parents[this.id]={element:this,title:s.attr("title")},s.attr("title",""))}),this._updateContent(s,e))},_updateContent:function(t,e){var i,s=this.options.content,n=this,a=e?e.type:null;return"string"==typeof s?this._open(e,t,s):(i=s.call(t[0],function(i){t.data("ui-tooltip-open")&&n._delay(function(){e&&(e.type=a),this._open(e,t,i)})}),i&&this._open(e,t,i),void 0)},_open:function(i,s,n){function a(t){h.of=t,o.is(":hidden")||o.position(h)}var o,r,l,h=t.extend({},this.options.position);if(n){if(o=this._find(s),o.length)return o.find(".ui-tooltip-content").html(n),void 0;s.is("[title]")&&(i&&"mouseover"===i.type?s.attr("title",""):s.removeAttr("title")),o=this._tooltip(s),e(s,o.attr("id")),o.find(".ui-tooltip-content").html(n),this.options.track&&i&&/^mouse/.test(i.type)?(this._on(this.document,{mousemove:a}),a(i)):o.position(t.extend({of:s},this.options.position)),o.hide(),this._show(o,this.options.show),this.options.show&&this.options.show.delay&&(l=this.delayedShow=setInterval(function(){o.is(":visible")&&(a(h.of),clearInterval(l))},t.fx.interval)),this._trigger("open",i,{tooltip:o}),r={keyup:function(e){if(e.keyCode===t.ui.keyCode.ESCAPE){var i=t.Event(e);i.currentTarget=s[0],this.close(i,!0)}},remove:function(){this._removeTooltip(o)}},i&&"mouseover"!==i.type||(r.mouseleave="close"),i&&"focusin"!==i.type||(r.focusout="close"),this._on(!0,s,r)}},close:function(e){var s=this,n=t(e?e.currentTarget:this.element),a=this._find(n);this.closing||(clearInterval(this.delayedShow),n.data("ui-tooltip-title")&&n.attr("title",n.data("ui-tooltip-title")),i(n),a.stop(!0),this._hide(a,this.options.hide,function(){s._removeTooltip(t(this))}),n.removeData("ui-tooltip-open"),this._off(n,"mouseleave focusout keyup"),n[0]!==this.element[0]&&this._off(n,"remove"),this._off(this.document,"mousemove"),e&&"mouseleave"===e.type&&t.each(this.parents,function(e,i){t(i.element).attr("title",i.title),delete s.parents[e]}),this.closing=!0,this._trigger("close",e,{tooltip:a}),this.closing=!1)},_tooltip:function(e){var i="ui-tooltip-"+s++,n=t("<div>").attr({id:i,role:"tooltip"}).addClass("ui-tooltip ui-widget ui-corner-all ui-widget-content "+(this.options.tooltipClass||""));return t("<div>").addClass("ui-tooltip-content").appendTo(n),n.appendTo(this.document[0].body),this.tooltips[i]=e,n},_find:function(e){var i=e.data("ui-tooltip-id");return i?t("#"+i):t()},_removeTooltip:function(t){t.remove(),delete this.tooltips[t.attr("id")]},_destroy:function(){var e=this;t.each(this.tooltips,function(i,s){var n=t.Event("blur");n.target=n.currentTarget=s[0],e.close(n,!0),t("#"+i).remove(),s.data("ui-tooltip-title")&&(s.attr("title",s.data("ui-tooltip-title")),s.removeData("ui-tooltip-title"))})}})}
(jQuery),
    function(t,e){var i="ui-effects-";t.effects={effect:{}},function(t,e){function i(t,e,i){var s=u[e.type]||{};return null==t?i||!e.def?null:e.def:(t=s.floor?~~t:parseFloat(t),isNaN(t)?e.def:s.mod?(t+s.mod)%s.mod:0>t?0:t>s.max?s.max:t)}function s(i){var s=h(),n=s._rgba=[];return i=i.toLowerCase(),f(l,function(t,a){var o,r=a.re.exec(i),l=r&&a.parse(r),h=a.space||"rgba";return l?(o=s[h](l),s[c[h].cache]=o[c[h].cache],n=s._rgba=o._rgba,!1):e}),n.length?("0,0,0,0"===n.join()&&t.extend(n,a.transparent),s):a[i]}function n(t,e,i){return i=(i+1)%1,1>6*i?t+6*(e-t)*i:1>2*i?e:2>3*i?t+6*(e-t)*(2/3-i):t}var a,o="backgroundColor borderBottomColor borderLeftColor borderRightColor borderTopColor color columnRuleColor outlineColor textDecorationColor textEmphasisColor",r=/^([\-+])=\s*(\d+\.?\d*)/,l=[{re:/rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,parse:function(t){return[t[1],t[2],t[3],t[4]]}},{re:/rgba?\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,parse:function(t){return[2.55*t[1],2.55*t[2],2.55*t[3],t[4]]}},{re:/#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})/,parse:function(t){return[parseInt(t[1],16),parseInt(t[2],16),parseInt(t[3],16)]}},{re:/#([a-f0-9])([a-f0-9])([a-f0-9])/,parse:function(t){return[parseInt(t[1]+t[1],16),parseInt(t[2]+t[2],16),parseInt(t[3]+t[3],16)]}},{re:/hsla?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,space:"hsla",parse:function(t){return[t[1],t[2]/100,t[3]/100,t[4]]}}],h=t.Color=function(e,i,s,n){return new t.Color.fn.parse(e,i,s,n)},c={rgba:{props:{red:{idx:0,type:"byte"},green:{idx:1,type:"byte"},blue:{idx:2,type:"byte"}}},hsla:{props:{hue:{idx:0,type:"degrees"},saturation:{idx:1,type:"percent"},lightness:{idx:2,type:"percent"}}}},u={"byte":{floor:!0,max:255},percent:{max:1},degrees:{mod:360,floor:!0}},d=h.support={},p=t("<p>")[0],f=t.each;p.style.cssText="background-color:rgba(1,1,1,.5)",d.rgba=p.style.backgroundColor.indexOf("rgba")>-1,f(c,function(t,e){e.cache="_"+t,e.props.alpha={idx:3,type:"percent",def:1}}),h.fn=t.extend(h.prototype,{parse:function(n,o,r,l){if(n===e)return this._rgba=[null,null,null,null],this;(n.jquery||n.nodeType)&&(n=t(n).css(o),o=e);var u=this,d=t.type(n),p=this._rgba=[];return o!==e&&(n=[n,o,r,l],d="array"),"string"===d?this.parse(s(n)||a._default):"array"===d?(f(c.rgba.props,function(t,e){p[e.idx]=i(n[e.idx],e)}),this):"object"===d?(n instanceof h?f(c,function(t,e){n[e.cache]&&(u[e.cache]=n[e.cache].slice())}):f(c,function(e,s){var a=s.cache;f(s.props,function(t,e){if(!u[a]&&s.to){if("alpha"===t||null==n[t])return;u[a]=s.to(u._rgba)}u[a][e.idx]=i(n[t],e,!0)}),u[a]&&0>t.inArray(null,u[a].slice(0,3))&&(u[a][3]=1,s.from&&(u._rgba=s.from(u[a])))}),this):e},is:function(t){var i=h(t),s=!0,n=this;return f(c,function(t,a){var o,r=i[a.cache];return r&&(o=n[a.cache]||a.to&&a.to(n._rgba)||[],f(a.props,function(t,i){return null!=r[i.idx]?s=r[i.idx]===o[i.idx]:e})),s}),s},_space:function(){var t=[],e=this;return f(c,function(i,s){e[s.cache]&&t.push(i)}),t.pop()},transition:function(t,e){var s=h(t),n=s._space(),a=c[n],o=0===this.alpha()?h("transparent"):this,r=o[a.cache]||a.to(o._rgba),l=r.slice();return s=s[a.cache],f(a.props,function(t,n){var a=n.idx,o=r[a],h=s[a],c=u[n.type]||{};null!==h&&(null===o?l[a]=h:(c.mod&&(h-o>c.mod/2?o+=c.mod:o-h>c.mod/2&&(o-=c.mod)),l[a]=i((h-o)*e+o,n)))}),this[n](l)},blend:function(e){if(1===this._rgba[3])return this;var i=this._rgba.slice(),s=i.pop(),n=h(e)._rgba;return h(t.map(i,function(t,e){return(1-s)*n[e]+s*t}))},toRgbaString:function(){var e="rgba(",i=t.map(this._rgba,function(t,e){return null==t?e>2?1:0:t});return 1===i[3]&&(i.pop(),e="rgb("),e+i.join()+")"},toHslaString:function(){var e="hsla(",i=t.map(this.hsla(),function(t,e){return null==t&&(t=e>2?1:0),e&&3>e&&(t=Math.round(100*t)+"%"),t});return 1===i[3]&&(i.pop(),e="hsl("),e+i.join()+")"

    },toHexString:function(e){var i=this._rgba.slice(),s=i.pop();
        return e&&i.push(~~(255*s)),"#"+t.map(i,function(t){return t=(t||0).toString(16),1===t.length?"0"+t:t}).join("")},
        toString:function(){return 0===this._rgba[3]?"transparent":this.toRgbaString()}}),
        h.fn.parse.prototype=h.fn,c.hsla.to=function(t){if(null==t[0]||null==t[1]||null==t[2])return[null,null,null,t[3]];var e,i,s=t[0]/255,n=t[1]/255,a=t[2]/255,o=t[3],r=Math.max(s,n,a),l=Math.min(s,n,a),h=r-l,c=r+l,u=.5*c;return e=l===r?0:s===r?60*(n-a)/h+360:n===r?60*(a-s)/h+120:60*(s-n)/h+240,i=0===h?0:.5>=u?h/c:h/(2-c),[Math.round(e)%360,i,u,null==o?1:o]},c.hsla.from=function(t){if(null==t[0]||null==t[1]||null==t[2])return[null,null,null,t[3]];var e=t[0]/360,i=t[1],s=t[2],a=t[3],o=.5>=s?s*(1+i):s+i-s*i,r=2*s-o;return[Math.round(255*n(r,o,e+1/3)),Math.round(255*n(r,o,e)),Math.round(255*n(r,o,e-1/3)),a]},f(c,function(s,n){var a=n.props,o=n.cache,l=n.to,c=n.from;h.fn[s]=function(s){if(l&&!this[o]&&(this[o]=l(this._rgba)),s===e)return this[o].slice();var n,r=t.type(s),u="array"===r||"object"===r?s:arguments,d=this[o].slice();return f(a,function(t,e){var s=u["object"===r?t:e.idx];null==s&&(s=d[e.idx]),d[e.idx]=i(s,e)}),c?(n=h(c(d)),n[o]=d,n):h(d)},f(a,function(e,i){h.fn[e]||(h.fn[e]=function(n){var a,o=t.type(n),l="alpha"===e?this._hsla?"hsla":"rgba":s,h=this[l](),c=h[i.idx];return"undefined"===o?c:("function"===o&&(n=n.call(this,c),o=t.type(n)),null==n&&i.empty?this:("string"===o&&(a=r.exec(n),a&&(n=c+parseFloat(a[2])*("+"===a[1]?1:-1))),h[i.idx]=n,this[l](h)))})})}),h.hook=function(e){var i=e.split(" ");f(i,function(e,i){t.cssHooks[i]={set:function(e,n){var a,o,r="";if("transparent"!==n&&("string"!==t.type(n)||(a=s(n)))){if(n=h(a||n),!d.rgba&&1!==n._rgba[3]){for(o="backgroundColor"===i?e.parentNode:e;(""===r||"transparent"===r)&&o&&o.style;)try{r=t.css(o,"backgroundColor"),o=o.parentNode}catch(l){}n=n.blend(r&&"transparent"!==r?r:"_default")}n=n.toRgbaString()}try{e.style[i]=n}catch(l){}}},t.fx.step[i]=function(e){e.colorInit||(e.start=h(e.elem,i),e.end=h(e.end),e.colorInit=!0),t.cssHooks[i].set(e.elem,e.start.transition(e.end,e.pos))}})},h.hook(o),t.cssHooks.borderColor={expand:function(t){var e={};return f(["Top","Right","Bottom","Left"],function(i,s){e["border"+s+"Color"]=t}),e}},a=t.Color.names={aqua:"#00ffff",black:"#000000",blue:"#0000ff",fuchsia:"#ff00ff",gray:"#808080",green:"#008000",lime:"#00ff00",maroon:"#800000",navy:"#000080",olive:"#808000",purple:"#800080",red:"#ff0000",silver:"#c0c0c0",teal:"#008080",white:"#ffffff",yellow:"#ffff00",transparent:[null,null,null,0],_default:"#ffffff"}}
    (jQuery),
        function(){function i(e){var i,s,n=e.ownerDocument.defaultView?e.ownerDocument.defaultView.getComputedStyle(e,null):e.currentStyle,a={};if(n&&n.length&&n[0]&&n[n[0]])for(s=n.length;s--;)i=n[s],"string"==typeof n[i]&&(a[t.camelCase(i)]=n[i]);else for(i in n)"string"==typeof n[i]&&(a[i]=n[i]);return a}
            function s(e,i){var s,n,o={};for(s in i)n=i[s],e[s]!==n&&(a[s]||(t.fx.step[s]||!isNaN(parseFloat(n)))&&(o[s]=n));
                return o}var n=["add","remove","toggle"],a={border:1,borderBottom:1,borderColor:1,borderLeft:1,borderRight:1,borderTop:1,borderWidth:1,margin:1,padding:1};t.each(["borderLeftStyle","borderRightStyle","borderBottomStyle","borderTopStyle"],function(e,i){t.fx.step[i]=function(t){("none"!==t.end&&!t.setAttr||1===t.pos&&!t.setAttr)&&(jQuery.style(t.elem,i,t.end),t.setAttr=!0)}}),t.fn.addBack||(t.fn.addBack=function(t){return this.add(null==t?this.prevObject:this.prevObject.filter(t))}),t.effects.animateClass=function(e,a,o,r){var l=t.speed(a,o,r);return this.queue(function(){var a,o=t(this),r=o.attr("class")||"",h=l.children?o.find("*").addBack():o;h=h.map(function(){var e=t(this);return{el:e,start:i(this)}}),a=function(){t.each(n,function(t,i){e[i]&&o[i+"Class"](e[i])})},a(),h=h.map(function(){return this.end=i(this.el[0]),this.diff=s(this.start,this.end),this}),o.attr("class",r),h=h.map(function(){var e=this,i=t.Deferred(),s=t.extend({},l,{queue:!1,complete:function(){i.resolve(e)}});return this.el.animate(this.diff,s),i.promise()}),t.when.apply(t,h.get()).done(function(){a(),t.each(arguments,function(){var e=this.el;t.each(this.diff,function(t){e.css(t,"")})}),l.complete.call(o[0])})})},t.fn.extend({addClass:function(e){return function(i,s,n,a){return s?t.effects.animateClass.call(this,{add:i},s,n,a):e.apply(this,arguments)}}(t.fn.addClass),removeClass:function(e){return function(i,s,n,a){return arguments.length>1?t.effects.animateClass.call(this,{remove:i},s,n,a):e.apply(this,arguments)}}(t.fn.removeClass),toggleClass:function(i){return function(s,n,a,o,r){return"boolean"==typeof n||n===e?a?t.effects.animateClass.call(this,n?{add:s}:{remove:s},a,o,r):i.apply(this,arguments):t.effects.animateClass.call(this,{toggle:s},n,a,o)}}(t.fn.toggleClass),switchClass:function(e,i,s,n,a){return t.effects.animateClass.call(this,{add:i,remove:e},s,n,a)}})}(),function(){function s(e,i,s,n){return t.isPlainObject(e)&&(i=e,e=e.effect),e={effect:e},null==i&&(i={}),t.isFunction(i)&&(n=i,s=null,i={}),("number"==typeof i||t.fx.speeds[i])&&(n=s,s=i,i={}),t.isFunction(s)&&(n=s,s=null),i&&t.extend(e,i),s=s||i.duration,e.duration=t.fx.off?0:"number"==typeof s?s:s in t.fx.speeds?t.fx.speeds[s]:t.fx.speeds._default,e.complete=n||i.complete,e}function n(e){return!e||"number"==typeof e||t.fx.speeds[e]?!0:"string"!=typeof e||t.effects.effect[e]?t.isFunction(e)?!0:"object"!=typeof e||e.effect?!1:!0:!0}t.extend(t.effects,{version:"1.10.3",save:function(t,e){for(var s=0;e.length>s;s++)null!==e[s]&&t.data(i+e[s],t[0].style[e[s]])},restore:function(t,s){var n,a;for(a=0;s.length>a;a++)null!==s[a]&&(n=t.data(i+s[a]),n===e&&(n=""),t.css(s[a],n))},setMode:function(t,e){return"toggle"===e&&(e=t.is(":hidden")?"show":"hide"),e},
        getBaseline:function(t,e){var i,s;switch(t[0]){case"top":i=0;break;case"middle":i=.5;break;case"bottom":i=1;break;default:i=t[0]/e.height}switch(t[1]){case"left":s=0;break;case"center":s=.5;break;case"right":s=1;break;default:s=t[1]/e.width}return{x:s,y:i}},createWrapper:function(e){if(e.parent().is(".ui-effects-wrapper"))return e.parent();var i={width:e.outerWidth(!0),height:e.outerHeight(!0),"float":e.css("float")},s=t("<div></div>").addClass("ui-effects-wrapper").css({fontSize:"100%",background:"transparent",border:"none",margin:0,padding:0}),n={width:e.width(),height:e.height()},a=document.activeElement;try{a.id}catch(o){a=document.body}return e.wrap(s),(e[0]===a||t.contains(e[0],a))&&t(a).focus(),s=e.parent(),"static"===e.css("position")?(s.css({position:"relative"}),e.css({position:"relative"})):(t.extend(i,{position:e.css("position"),zIndex:e.css("z-index")}),t.each(["top","left","bottom","right"],function(t,s){i[s]=e.css(s),isNaN(parseInt(i[s],10))&&(i[s]="auto")}),e.css({position:"relative",top:0,left:0,right:"auto",bottom:"auto"})),e.css(n),s.css(i).show()},removeWrapper:function(e){var i=document.activeElement;return e.parent().is(".ui-effects-wrapper")&&(e.parent().replaceWith(e),(e[0]===i||t.contains(e[0],i))&&t(i).focus()),e},setTransition:function(e,i,s,n){return n=n||{},t.each(i,function(t,i){var a=e.cssUnit(i);a[0]>0&&(n[i]=a[0]*s+a[1])}),n}}),t.fn.extend({effect:function(){function e(e){function s(){t.isFunction(a)&&a.call(n[0]),t.isFunction(e)&&e()}var n=t(this),a=i.complete,r=i.mode;(n.is(":hidden")?"hide"===r:"show"===r)?(n[r](),s()):o.call(n[0],i,s)}var i=s.apply(this,arguments),n=i.mode,a=i.queue,o=t.effects.effect[i.effect];return t.fx.off||!o?n?this[n](i.duration,i.complete):this.each(function(){i.complete&&i.complete.call(this)}):a===!1?this.each(e):this.queue(a||"fx",e)},show:function(t){return function(e){if(n(e))return t.apply(this,arguments);var i=s.apply(this,arguments);return i.mode="show",this.effect.call(this,i)}}(t.fn.show),hide:function(t){return function(e){if(n(e))return t.apply(this,arguments);var i=s.apply(this,arguments);return i.mode="hide",this.effect.call(this,i)}}(t.fn.hide),toggle:function(t){return function(e){if(n(e)||"boolean"==typeof e)return t.apply(this,arguments);var i=s.apply(this,arguments);return i.mode="toggle",this.effect.call(this,i)}}(t.fn.toggle),cssUnit:function(e){var i=this.css(e),s=[];return t.each(["em","px","%","pt"],function(t,e){i.indexOf(e)>0&&(s=[parseFloat(i),e])}),s}})}(),function(){var e={};t.each(["Quad","Cubic","Quart","Quint","Expo"],function(t,i){e[i]=function(e){return Math.pow(e,t+2)}}),t.extend(e,{Sine:function(t){return 1-Math.cos(t*Math.PI/2)},Circ:function(t){return 1-Math.sqrt(1-t*t)},Elastic:function(t){return 0===t||1===t?t:-Math.pow(2,8*(t-1))*Math.sin((80*(t-1)-7.5)*Math.PI/15)},Back:function(t){return t*t*(3*t-2)},Bounce:function(t){for(var e,i=4;((e=Math.pow(2,--i))-1)/11>t;);return 1/Math.pow(4,3-i)-7.5625*Math.pow((3*e-2)/22-t,2)}}),t.each(e,function(e,i){t.easing["easeIn"+e]=i,t.easing["easeOut"+e]=function(t){return 1-i(1-t)},t.easing["easeInOut"+e]=function(t){return.5>t?i(2*t)/2:1-i(-2*t+2)/2}})}()}
    (jQuery),
    function(t){var e=/up|down|vertical/,i=/up|left|vertical|horizontal/;t.effects.effect.blind=function(s,n){var a,o,r,l=t(this),h=["position","top","bottom","left","right","height","width"],c=t.effects.setMode(l,s.mode||"hide"),u=s.direction||"up",d=e.test(u),p=d?"height":"width",f=d?"top":"left",g=i.test(u),m={},v="show"===c;l.parent().is(".ui-effects-wrapper")?t.effects.save(l.parent(),h):t.effects.save(l,h),l.show(),a=t.effects.createWrapper(l).css({overflow:"hidden"}),o=a[p](),r=parseFloat(a.css(f))||0,m[p]=v?o:0,g||(l.css(d?"bottom":"right",0).css(d?"top":"left","auto").css({position:"absolute"}),m[f]=v?r:o+r),v&&(a.css(p,0),g||a.css(f,r+o)),a.animate(m,{duration:s.duration,easing:s.easing,queue:!1,complete:function(){"hide"===c&&l.hide(),t.effects.restore(l,h),t.effects.removeWrapper(l),n()}})}}
    (jQuery),
    function(t){t.effects.effect.bounce=function(e,i){var s,n,a,o=t(this),r=["position","top","bottom","left","right","height","width"],l=t.effects.setMode(o,e.mode||"effect"),h="hide"===l,c="show"===l,u=e.direction||"up",d=e.distance,p=e.times||5,f=2*p+(c||h?1:0),g=e.duration/f,m=e.easing,v="up"===u||"down"===u?"top":"left",_="up"===u||"left"===u,b=o.queue(),y=b.length;for((c||h)&&r.push("opacity"),t.effects.save(o,r),o.show(),t.effects.createWrapper(o),d||(d=o["top"===v?"outerHeight":"outerWidth"]()/3),c&&(a={opacity:1},a[v]=0,o.css("opacity",0).css(v,_?2*-d:2*d).animate(a,g,m)),h&&(d/=Math.pow(2,p-1)),a={},a[v]=0,s=0;p>s;s++)n={},n[v]=(_?"-=":"+=")+d,o.animate(n,g,m).animate(a,g,m),d=h?2*d:d/2;h&&(n={opacity:0},n[v]=(_?"-=":"+=")+d,o.animate(n,g,m)),o.queue(function(){h&&o.hide(),t.effects.restore(o,r),t.effects.removeWrapper(o),i()}),y>1&&b.splice.apply(b,[1,0].concat(b.splice(y,f+1))),o.dequeue()}}
    (jQuery),
    function(t){t.effects.effect.clip=function(e,i){var s,n,a,o=t(this),r=["position","top","bottom","left","right","height","width"],l=t.effects.setMode(o,e.mode||"hide"),h="show"===l,c=e.direction||"vertical",u="vertical"===c,d=u?"height":"width",p=u?"top":"left",f={};t.effects.save(o,r),o.show(),s=t.effects.createWrapper(o).css({overflow:"hidden"}),n="IMG"===o[0].tagName?s:o,a=n[d](),h&&(n.css(d,0),n.css(p,a/2)),f[d]=h?a:0,f[p]=h?0:a/2,n.animate(f,{queue:!1,duration:e.duration,easing:e.easing,complete:function(){h||o.hide(),t.effects.restore(o,r),t.effects.removeWrapper(o),i()}})}}
    (jQuery),
    function(t){t.effects.effect.drop=function(e,i){var s,n=t(this),a=["position","top","bottom","left","right","opacity","height","width"],o=t.effects.setMode(n,e.mode||"hide"),r="show"===o,l=e.direction||"left",h="up"===l||"down"===l?"top":"left",c="up"===l||"left"===l?"pos":"neg",u={opacity:r?1:0};t.effects.save(n,a),n.show(),t.effects.createWrapper(n),s=e.distance||n["top"===h?"outerHeight":"outerWidth"](!0)/2,r&&n.css("opacity",0).css(h,"pos"===c?-s:s),u[h]=(r?"pos"===c?"+=":"-=":"pos"===c?"-=":"+=")+s,n.animate(u,{queue:!1,duration:e.duration,easing:e.easing,complete:function(){"hide"===o&&n.hide(),t.effects.restore(n,a),t.effects.removeWrapper(n),i()}})}}
    (jQuery),
    function(t){t.effects.effect.explode=function(e,i){function s(){b.push(this),b.length===u*d&&n()}function n(){p.css({visibility:"visible"}),t(b).remove(),g||p.hide(),i()}var a,o,r,l,h,c,u=e.pieces?Math.round(Math.sqrt(e.pieces)):3,d=u,p=t(this),f=t.effects.setMode(p,e.mode||"hide"),g="show"===f,m=p.show().css("visibility","hidden").offset(),v=Math.ceil(p.outerWidth()/d),_=Math.ceil(p.outerHeight()/u),b=[];for(a=0;u>a;a++)for(l=m.top+a*_,c=a-(u-1)/2,o=0;d>o;o++)r=m.left+o*v,h=o-(d-1)/2,p.clone().appendTo("body").wrap("<div></div>").css({position:"absolute",visibility:"visible",left:-o*v,top:-a*_}).parent().addClass("ui-effects-explode").css({position:"absolute",overflow:"hidden",width:v,height:_,left:r+(g?h*v:0),top:l+(g?c*_:0),opacity:g?0:1}).animate({left:r+(g?0:h*v),top:l+(g?0:c*_),opacity:g?1:0},e.duration||500,e.easing,s)}}
    (jQuery),
    function(t){t.effects.effect.fade=function(e,i){var s=t(this),n=t.effects.setMode(s,e.mode||"toggle");s.animate({opacity:n},{queue:!1,duration:e.duration,easing:e.easing,complete:i})}}
    (jQuery),
    function(t){t.effects.effect.fold=function(e,i){var s,n,a=t(this),o=["position","top","bottom","left","right","height","width"],r=t.effects.setMode(a,e.mode||"hide"),l="show"===r,h="hide"===r,c=e.size||15,u=/([0-9]+)%/.exec(c),d=!!e.horizFirst,p=l!==d,f=p?["width","height"]:["height","width"],g=e.duration/2,m={},v={};t.effects.save(a,o),a.show(),s=t.effects.createWrapper(a).css({overflow:"hidden"}),n=p?[s.width(),s.height()]:[s.height(),s.width()],u&&(c=parseInt(u[1],10)/100*n[h?0:1]),l&&s.css(d?{height:0,width:c}:{height:c,width:0}),m[f[0]]=l?n[0]:c,v[f[1]]=l?n[1]:0,s.animate(m,g,e.easing).animate(v,g,e.easing,function(){h&&a.hide(),t.effects.restore(a,o),t.effects.removeWrapper(a),i()})}}
    (jQuery),
    function(t){t.effects.effect.highlight=function(e,i){var s=t(this),n=["backgroundImage","backgroundColor","opacity"],a=t.effects.setMode(s,e.mode||"show"),o={backgroundColor:s.css("backgroundColor")};"hide"===a&&(o.opacity=0),t.effects.save(s,n),s.show().css({backgroundImage:"none",backgroundColor:e.color||"#ffff99"}).animate(o,{queue:!1,duration:e.duration,easing:e.easing,complete:function(){"hide"===a&&s.hide(),t.effects.restore(s,n),i()}})}}
    (jQuery),
    function(t){t.effects.effect.pulsate=function(e,i){var s,n=t(this),a=t.effects.setMode(n,e.mode||"show"),o="show"===a,r="hide"===a,l=o||"hide"===a,h=2*(e.times||5)+(l?1:0),c=e.duration/h,u=0,d=n.queue(),p=d.length;for((o||!n.is(":visible"))&&(n.css("opacity",0).show(),u=1),s=1;h>s;s++)n.animate({opacity:u},c,e.easing),u=1-u;n.animate({opacity:u},c,e.easing),n.queue(function(){r&&n.hide(),i()}),p>1&&d.splice.apply(d,[1,0].concat(d.splice(p,h+1))),n.dequeue()}}
    (jQuery),
    function(t){t.effects.effect.puff=function(e,i){var s=t(this),n=t.effects.setMode(s,e.mode||"hide"),a="hide"===n,o=parseInt(e.percent,10)||150,r=o/100,l={height:s.height(),width:s.width(),outerHeight:s.outerHeight(),outerWidth:s.outerWidth()};
        t.extend(e,{effect:"scale",queue:!1,fade:!0,mode:n,complete:i,percent:a?o:100,from:a?l:{height:l.height*r,width:l.width*r,outerHeight:l.outerHeight*r,outerWidth:l.outerWidth*r}}),s.effect(e)},t.effects.effect.scale=function(e,i){var s=t(this),n=t.extend(!0,{},e),a=t.effects.setMode(s,e.mode||"effect"),o=parseInt(e.percent,10)||(0===parseInt(e.percent,10)?0:"hide"===a?0:100),r=e.direction||"both",l=e.origin,h={height:s.height(),width:s.width(),outerHeight:s.outerHeight(),outerWidth:s.outerWidth()},c={y:"horizontal"!==r?o/100:1,x:"vertical"!==r?o/100:1};n.effect="size",n.queue=!1,n.complete=i,"effect"!==a&&(n.origin=l||["middle","center"],n.restore=!0),n.from=e.from||("show"===a?{height:0,width:0,outerHeight:0,outerWidth:0}:h),n.to={height:h.height*c.y,width:h.width*c.x,outerHeight:h.outerHeight*c.y,outerWidth:h.outerWidth*c.x},n.fade&&("show"===a&&(n.from.opacity=0,n.to.opacity=1),"hide"===a&&(n.from.opacity=1,n.to.opacity=0)),s.effect(n)},t.effects.effect.size=function(e,i){var s,n,a,o=t(this),r=["position","top","bottom","left","right","width","height","overflow","opacity"],l=["position","top","bottom","left","right","overflow","opacity"],h=["width","height","overflow"],c=["fontSize"],u=["borderTopWidth","borderBottomWidth","paddingTop","paddingBottom"],d=["borderLeftWidth","borderRightWidth","paddingLeft","paddingRight"],p=t.effects.setMode(o,e.mode||"effect"),f=e.restore||"effect"!==p,g=e.scale||"both",m=e.origin||["middle","center"],v=o.css("position"),_=f?r:l,b={height:0,width:0,outerHeight:0,outerWidth:0};"show"===p&&o.show(),s={height:o.height(),width:o.width(),outerHeight:o.outerHeight(),outerWidth:o.outerWidth()},"toggle"===e.mode&&"show"===p?(o.from=e.to||b,o.to=e.from||s):(o.from=e.from||("show"===p?b:s),o.to=e.to||("hide"===p?b:s)),a={from:{y:o.from.height/s.height,x:o.from.width/s.width},to:{y:o.to.height/s.height,x:o.to.width/s.width}},("box"===g||"both"===g)&&(a.from.y!==a.to.y&&(_=_.concat(u),o.from=t.effects.setTransition(o,u,a.from.y,o.from),o.to=t.effects.setTransition(o,u,a.to.y,o.to)),a.from.x!==a.to.x&&(_=_.concat(d),o.from=t.effects.setTransition(o,d,a.from.x,o.from),o.to=t.effects.setTransition(o,d,a.to.x,o.to))),("content"===g||"both"===g)&&a.from.y!==a.to.y&&(_=_.concat(c).concat(h),o.from=t.effects.setTransition(o,c,a.from.y,o.from),o.to=t.effects.setTransition(o,c,a.to.y,o.to)),t.effects.save(o,_),o.show(),t.effects.createWrapper(o),o.css("overflow","hidden").css(o.from),m&&(n=t.effects.getBaseline(m,s),o.from.top=(s.outerHeight-o.outerHeight())*n.y,o.from.left=(s.outerWidth-o.outerWidth())*n.x,o.to.top=(s.outerHeight-o.to.outerHeight)*n.y,o.to.left=(s.outerWidth-o.to.outerWidth)*n.x),o.css(o.from),("content"===g||"both"===g)&&(u=u.concat(["marginTop","marginBottom"]).concat(c),d=d.concat(["marginLeft","marginRight"]),h=r.concat(u).concat(d),o.find("*[width]").each(function(){var i=t(this),s={height:i.height(),width:i.width(),outerHeight:i.outerHeight(),outerWidth:i.outerWidth()};f&&t.effects.save(i,h),i.from={height:s.height*a.from.y,width:s.width*a.from.x,outerHeight:s.outerHeight*a.from.y,outerWidth:s.outerWidth*a.from.x},i.to={height:s.height*a.to.y,width:s.width*a.to.x,outerHeight:s.height*a.to.y,outerWidth:s.width*a.to.x},a.from.y!==a.to.y&&(i.from=t.effects.setTransition(i,u,a.from.y,i.from),i.to=t.effects.setTransition(i,u,a.to.y,i.to)),a.from.x!==a.to.x&&(i.from=t.effects.setTransition(i,d,a.from.x,i.from),i.to=t.effects.setTransition(i,d,a.to.x,i.to)),i.css(i.from),i.animate(i.to,e.duration,e.easing,function(){f&&t.effects.restore(i,h)})})),o.animate(o.to,{queue:!1,duration:e.duration,easing:e.easing,complete:function(){0===o.to.opacity&&o.css("opacity",o.from.opacity),"hide"===p&&o.hide(),t.effects.restore(o,_),f||("static"===v?o.css({position:"relative",top:o.to.top,left:o.to.left}):t.each(["top","left"],function(t,e){o.css(e,function(e,i){var s=parseInt(i,10),n=t?o.to.left:o.to.top;return"auto"===i?n+"px":s+n+"px"})})),t.effects.removeWrapper(o),i()}})}}
    (jQuery),
    function(t){t.effects.effect.shake=function(e,i){var s,n=t(this),a=["position","top","bottom","left","right","height","width"],o=t.effects.setMode(n,e.mode||"effect"),r=e.direction||"left",l=e.distance||20,h=e.times||3,c=2*h+1,u=Math.round(e.duration/c),d="up"===r||"down"===r?"top":"left",p="up"===r||"left"===r,f={},g={},m={},v=n.queue(),_=v.length;for(t.effects.save(n,a),n.show(),t.effects.createWrapper(n),f[d]=(p?"-=":"+=")+l,g[d]=(p?"+=":"-=")+2*l,m[d]=(p?"-=":"+=")+2*l,n.animate(f,u,e.easing),s=1;h>s;s++)n.animate(g,u,e.easing).animate(m,u,e.easing);n.animate(g,u,e.easing).animate(f,u/2,e.easing).queue(function(){"hide"===o&&n.hide(),t.effects.restore(n,a),t.effects.removeWrapper(n),i()}),_>1&&v.splice.apply(v,[1,0].concat(v.splice(_,c+1))),n.dequeue()}}
    (jQuery),
    function(t){t.effects.effect.slide=function(e,i){var s,n=t(this),a=["position","top","bottom","left","right","width","height"],o=t.effects.setMode(n,e.mode||"show"),r="show"===o,l=e.direction||"left",h="up"===l||"down"===l?"top":"left",c="up"===l||"left"===l,u={};t.effects.save(n,a),n.show(),s=e.distance||n["top"===h?"outerHeight":"outerWidth"](!0),t.effects.createWrapper(n).css({overflow:"hidden"}),r&&n.css(h,c?isNaN(s)?"-"+s:-s:s),u[h]=(r?c?"+=":"-=":c?"-=":"+=")+s,n.animate(u,{queue:!1,duration:e.duration,easing:e.easing,complete:function(){"hide"===o&&n.hide(),t.effects.restore(n,a),t.effects.removeWrapper(n),i()}})}}
    (jQuery),

    function(t) {t.effects.effect.transfer=function(e,i){var s=t(this),n=t(e.to),a="fixed"===n.css("position"),o=t("body"),r=a?o.scrollTop():0,l=a?o.scrollLeft():0,h=n.offset(),c={top:h.top-r,left:h.left-l,height:n.innerHeight(),width:n.innerWidth()},u=s.offset(),
        d=t("<div class='ui-effects-transfer'></div>").appendTo(document.body).addClass(e.className).css({top:u.top-r,left:u.left-l,height:s.innerHeight(),width:s.innerWidth(),position:a?"fixed":"absolute"}
        ).animate(c,e.duration,e.easing,function(){d.remove(),i()})}}(jQuery);





//$('#calendar').fullCalendar

//FullcalendarEngine.render;
//});