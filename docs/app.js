'use strict';
// Standalone, offline-capable demo. There are no API calls or external dependencies.
const KEY='gjr-growth-demo:v1', BACKUP=KEY+':before-reset';
const $=s=>document.querySelector(s), esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const paths={home:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="9" cy="7" r="4"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',book:'<path d="M12 5v16M12 5C8 2 4 3 2 4v16c4-2 7-1 10 1 3-2 6-3 10-1V4c-3-1-6-2-10 1Z"/>',calendar:'<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4M17 3v4M3 11h18M8 15h1M15 15h1M8 18h1"/>',spark:'<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3ZM20 2v4M18 4h4"/>',wallet:'<rect x="3" y="5" width="18" height="15" rx="3"/><path d="M16 11h5v5h-5a2.5 2.5 0 0 1 0-5ZM6 5V3h12v2"/>',leaf:'<path d="M20 3C8 1 2 9 6 16s17 4 14-13ZM4 21 16 9M9 15v-5M9 15h6"/>',settings:'<circle cx="12" cy="12" r="3"/><path d="m9 3-1 3-3 1-2 3 2 2-1 3 3 2 2 3h4l1-3 3-1 2-3-2-2 1-3-3-2-2-3Z"/>',search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',plus:'<path d="M12 5v14M5 12h14"/>',arrow:'<path d="M4 12h16m-6-6 6 6-6 6"/>',chevron:'<path d="m9 5 7 7-7 7"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',pin:'<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="2"/>',check:'<path d="m5 12 4 4L19 6"/>',close:'<path d="m6 6 12 12M18 6 6 18"/>',menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',download:'<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',upload:'<path d="M12 16V4m-5 5 5-5 5 5M4 16v5h16v-5"/>',full:'<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/>',bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',heart:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',edit:'<path d="m16 3 5 5M4 20l5-1L21 7l-5-5L4 14v6Z"/>',archive:'<path d="M3 4h18v5H3zM5 9v12h14V9M10 13h4"/>',logout:'<path d="M9 4H4v16h5M12 12h10m-4-4 4 4-4 4"/>',chart:'<path d="M4 4v16h17M8 15l4-5 4 2 5-7"/>'};
const icon=(n,cl='')=>`<span class="icon ${cl}"><svg viewBox="0 0 24 24" aria-hidden="true">${paths[n]||paths.spark}</svg></span>`;
const dateStr=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const today=()=>dateStr(new Date());
const addDays=(s,n)=>{let d=new Date(s+'T12:00:00');d.setDate(d.getDate()+n);return dateStr(d)};
const dayLabel=s=>new Date(s+'T12:00:00').toLocaleDateString('zh-CN',{month:'long',day:'numeric'});
const longDate=s=>new Date(s+'T12:00:00').toLocaleDateString('zh-CN',{year:'numeric',month:'long',day:'numeric',weekday:'long'});
const money=n=>Number(n).toLocaleString('zh-CN',{maximumFractionDigits:2});
const uid=prefix=>prefix+'-'+(crypto.randomUUID?crypto.randomUUID():Date.now()+'-'+Math.random().toString(36).slice(2));
function seed(){const d=today();return {version:1,students:[
 {id:'s1',name:'林小满',grade:'七年级',parent:'林女士',phone:'',classId:'c1',total:24,remaining:18,status:'在读',remark:'喜欢独立思考，鼓励主动分享解题过程。',created:d},
 {id:'s2',name:'陈一诺',grade:'七年级',parent:'陈先生',phone:'',classId:'c1',total:24,remaining:20,status:'在读',remark:'课堂互动积极，注重计算习惯。',created:d},
 {id:'s3',name:'苏予安',grade:'八年级',parent:'苏女士',phone:'',classId:'c2',total:30,remaining:4,status:'在读',remark:'擅长图形观察，可以加强表达。',created:d},
 {id:'s4',name:'周知夏',grade:'五年级',parent:'周女士',phone:'',classId:'c3',total:24,remaining:16,status:'在读',remark:'好奇心强，喜欢挑战开放问题。',created:d},
 {id:'s5',name:'许星禾',grade:'七年级',parent:'许女士',phone:'',classId:'c1',total:24,remaining:15,status:'在读',remark:'善于合作，正在建立检查习惯。',created:d},
 {id:'s6',name:'沈思远',grade:'八年级',parent:'沈先生',phone:'',classId:'c2',total:30,remaining:3,status:'在读',remark:'逻辑清晰，建议拓展一题多解。',created:d},
 {id:'s7',name:'何沐阳',grade:'五年级',parent:'何女士',phone:'',classId:'c3',total:24,remaining:12,status:'在读',remark:'乐于表达，动手能力突出。',created:d},
 {id:'s8',name:'顾可欣',grade:'七年级',parent:'顾先生',phone:'',classId:'c1',total:24,remaining:21,status:'在读',remark:'认真细致，期待更多课堂分享。',created:d}],
 classes:[{id:'c1',name:'七年级 · 数学启航班',subject:'初中数学',teacher:'李老师',room:'向阳教室',capacity:12,description:'用好奇心开启数学的第一步。'}, {id:'c2',name:'八年级 · 数学进阶班',subject:'初中数学',teacher:'王老师',room:'星河教室',capacity:10,description:'在探索中找到更清晰的思考方式。'}, {id:'c3',name:'五年级 · 思维探索班',subject:'思维拓展',teacher:'陈老师',room:'云朵教室',capacity:8,description:'从一个好问题，走向更多可能。'}],
 lessons:[{id:'l1',classId:'c1',date:d,time:'16:30',duration:90,topic:'有理数：数轴上的奇妙旅行',checked:false}, {id:'l2',classId:'c3',date:d,time:'18:00',duration:60,topic:'图形与空间：观察的力量',checked:false},{id:'l3',classId:'c2',date:d,time:'19:30',duration:90,topic:'全等三角形：发现相同的秘密',checked:false},{id:'l4',classId:'c1',date:addDays(d,1),time:'17:00',duration:90,topic:'绝对值与数轴',checked:false},{id:'l5',classId:'c2',date:addDays(d,2),time:'14:00',duration:90,topic:'三角形中的证明思路',checked:false}],
 trials:[{id:'t1',name:'唐小禾',parent:'唐女士',phone:'',grade:'七年级',classId:'c1',date:addDays(d,1),status:'待试听',remark:'对趣味数学感兴趣。'},{id:'t2',name:'陆知行',parent:'陆先生',phone:'',grade:'五年级',classId:'c3',date:addDays(d,2),status:'待联系',remark:'希望培养思考和表达能力。'},{id:'t3',name:'江可乐',parent:'江女士',phone:'',grade:'八年级',classId:'c2',date:addDays(d,-1),status:'已试听',remark:'课堂适应良好，等待家长反馈。'}],
 enrollments:[{id:'e1',studentId:'s1',classId:'c1',hours:24,amount:2880,date:addDays(d,-20),method:'收款登记'},{id:'e2',studentId:'s3',classId:'c2',hours:30,amount:3600,date:addDays(d,-26),method:'收款登记'}],
 notes:[{id:'n1',studentId:'s1',title:'今天，勇敢地站上了讲台',content:'小满主动分享了自己的数轴解法，还认真回答了同学的提问。表达越来越自信，为这份勇气点赞！',tag:'自信表达',teacher:'李老师',date:d},{id:'n2',studentId:'s4',title:'从“我不会”到“让我试试”',content:'知夏尝试了三种不同的拼图方法，在一次次调整中找到了答案。耐心和探索精神都在成长。',tag:'探索精神',teacher:'陈老师',date:d},{id:'n3',studentId:'s6',title:'发现解题中的另一条路',content:'思远用辅助线提出了一种新的证明思路，并画图解释给同伴听。继续保持独立思考的好习惯。',tag:'独立思考',teacher:'王老师',date:addDays(d,-1)}],checkins:[]};}
function validateState(v){
 if(!v||v.version!==1)throw Error('不支持的数据版本');
 for(const k of ['students','classes','lessons','trials','enrollments','notes','checkins'])if(!Array.isArray(v[k])||v[k].length>10000)throw Error('数据结构不完整');
 const ids=a=>new Set(a.map(x=>x.id));
 for(const k of ['students','classes','lessons','trials','enrollments','notes']){if(ids(v[k]).size!==v[k].length)throw Error('存在重复记录');for(const x of v[k])if(!x||typeof x.id!=='string')throw Error('记录编号无效')}
 const c=ids(v.classes),s=ids(v.students),l=ids(v.lessons);
 for(const x of v.students)if(typeof x.name!=='string'||!Number.isFinite(x.total)||!Number.isFinite(x.remaining)||x.remaining<0||x.total<x.remaining||!c.has(x.classId))throw Error('学员或课时数据无效');
 for(const x of v.classes)if(typeof x.name!=='string'||!Number.isInteger(x.capacity)||x.capacity<1)throw Error('班级数据无效');
 for(const x of v.lessons)if(!c.has(x.classId)||!/^\d{4}-\d{2}-\d{2}$/.test(x.date)||!/^\d{2}:\d{2}$/.test(x.time)||!Number.isFinite(x.duration)||x.duration<1)throw Error('课表数据无效');
 for(const x of v.enrollments)if(!s.has(x.studentId)||!c.has(x.classId)||!Number.isFinite(x.hours)||x.hours<=0||!Number.isFinite(x.amount)||x.amount<0)throw Error('报名记录无效');
 for(const x of v.notes)if(!s.has(x.studentId)||typeof x.content!=='string')throw Error('成长记录无效');
 for(const x of v.trials)if(!c.has(x.classId)||typeof x.name!=='string')throw Error('试听记录无效');
 for(const x of v.checkins)if(!s.has(x.studentId)||!l.has(x.lessonId)||typeof x.present!=='boolean')throw Error('签到记录无效');
 return Domain.validate(Domain.upgrade(v));
}
let storageWarning='';
let state=(()=>{try{const raw=localStorage.getItem(KEY);if(raw)return validateState(JSON.parse(raw));const s=Domain.upgrade(seed());localStorage.setItem(KEY,JSON.stringify(s));return s}catch(e){storageWarning='已保存的数据暂时无法读取，可前往数据管理尝试恢复备份。';return Domain.upgrade(seed())}})();
let role='admin';try{role=sessionStorage.getItem(KEY+':role')||'admin'}catch{}
if(!['admin','teacher','parent','student'].includes(role))role='admin';
let loggedIn=true, selectedDay=today(), weekOffset=0, studentSearch='',studentClass='',studentStatus='',trialStatus='';
let route=(location.hash.slice(1)||'dashboard'),toastTimer;
const activeStudents=()=>state.students.filter(s=>!s.archived&&(role!=='teacher'||state.classes.find(c=>c.id===s.classId)?.teacher==='李老师')), cls=id=>state.classes.find(c=>c.id===id), stu=id=>state.students.find(s=>s.id===id);
const child=()=>activeStudents().find(s=>s.id==='s1')||activeStudents()[0];
const family=()=>role==='parent'||role==='student';
const canEdit=()=>role==='admin', canTeach=()=>role==='admin'||role==='teacher';
const roleName={admin:'校区管理员',teacher:'教师视角',parent:'家长视角',student:'学生视角'};
const navs=[['dashboard','home','成长工作台'],['students','users','学员管理'],['classes','book','班级管理'],['schedule','calendar','本周课表'],['trials','spark','试听跟进'],['enrollments','wallet','报名缴费'],['growth','leaf','成长记录'],['settings','settings','数据管理']];
navs.push(...[["courses","book","课程管理"],["hours","clock","课时管理"],["deductions","chart","消课明细"],["attendanceRecords","check","学生考勤"],["changes","edit","学生异动"],["points","wallet","学生银行"],["pointRanking","chart","积分排行榜"],["adjustments","calendar","调课补课停课"],["teacherHours","clock","教师课时费"],["settlements","wallet","教师结算"],["teacherRanking","chart","教师排行榜"],["feeWarnings","bell","费用预警"],["warnings","bell","预警中心"],["resources","book","教案资料库"],["aids","spark","教具申请"],["contacts","users","校区联系簿"],["staff","users","教师与管理员"],["groups","settings","角色权限"],["members","users","会员管理"],["memberGroups","users","会员分组"],["memberLevels","chart","会员等级"],["attachments","upload","附件管理"],["attachGroups","book","附件分组"],["configuration","settings","系统设置"],["configGroups","settings","配置分组"],["configItems","settings","配置项"],["blacklist","archive","黑名单记录"],["languages","book","语言词条"],["logs","chart","操作日志"]]);
const defaultAllowed=()=>family()?['dashboard','schedule','growth','points','deductions','attendanceRecords','enrollments','settings']:role==='teacher'?['dashboard','students','classes','schedule','hours','deductions','attendanceRecords','growth','points','pointRanking','adjustments','teacherHours','settlements','resources','aids','contacts','settings']:navs.map(x=>x[0]);
const allowed=()=>{const base=defaultAllowed();const g=state.groups.find(g=>g.id==='group-teacher');return role==='teacher'&&Array.isArray(g?.routes)?base.filter(r=>r==='dashboard'||r==='settings'||g.routes.includes(r)):base};
// Workspace tabs and recent page history are separate from the demo's business data.
const WORKSPACE_KEY=KEY+':workspace';
let workspaces={};
try { const saved=JSON.parse(sessionStorage.getItem(WORKSPACE_KEY)||'{}'); if(saved&&typeof saved==='object'&&!Array.isArray(saved))workspaces=saved; } catch {}
function workspace(){
 const valid=allowed();
 let w=workspaces[role];
 if(!w||typeof w!=='object'||Array.isArray(w))w=workspaces[role]={};
 w.tabs=['dashboard',...new Set((Array.isArray(w.tabs)?w.tabs:[]).filter(r=>r!=='dashboard'&&valid.includes(r)))];
 w.trail=(Array.isArray(w.trail)?w.trail:[]).filter(r=>valid.includes(r)).filter((r,i,a)=>i===0||r!==a[i-1]).slice(-80);
 if(!w.scrolls||typeof w.scrolls!=='object')w.scrolls={};
 if(!w.views||typeof w.views!=='object')w.views={};
 if(!valid.includes(w.current))w.current='dashboard';
 return w;
}
function rememberWorkspace(){
 rememberModuleWorkspace();
 const w=workspace();
 if(!w.tabs.includes(route))w.tabs.push(route);
 if(w.trail.at(-1)!==route)w.trail.push(route);
 w.trail=w.trail.slice(-80);
 w.current=route;
 w.views={studentSearch,studentClass,studentStatus,trialStatus,selectedDay,weekOffset};
 try { sessionStorage.setItem(WORKSPACE_KEY,JSON.stringify(workspaces)); } catch {}
}
function restoreWorkspace(){
 const v=workspace().views;
 studentSearch=typeof v.studentSearch==='string'?v.studentSearch.slice(0,200):'';
 studentClass=state.classes.some(c=>c.id===v.studentClass)?v.studentClass:'';
 studentStatus=['在读','暂停','low'].includes(v.studentStatus)?v.studentStatus:'';
 trialStatus=['待联系','待试听','已试听','已报名'].includes(v.trialStatus)?v.trialStatus:'';
 selectedDay=/^\d{4}-\d{2}-\d{2}$/.test(v.selectedDay)?v.selectedDay:today();
 weekOffset=Number.isInteger(v.weekOffset)&&Math.abs(v.weekOffset)<5200?v.weekOffset:0;
}
function workspaceTitle(r){return r==='dashboard'&&family()?(role==='parent'?'孩子的成长':'我的成长'):navs.find(n=>n[0]===r)?.[2]||'成长工作台'}
function workspaceBar(){
 const w=workspace(),previous=w.trail.length>1?w.trail.at(-2):null;
 return `<div class="workspace-bar" aria-label="页面工作区"><button class="workspace-back" data-action="page-back" ${previous?'':'disabled'} aria-label="返回上一个页面" title="${previous?'返回：'+esc(workspaceTitle(previous)):'已在起始页面'}"><span class="back-arrow">${icon('arrow')}</span><span>返回</span></button><div class="workspace-tabs" role="tablist" aria-label="已打开的页面">${w.tabs.map(r=>`<div class="workspace-tab ${r===route?'active':''}" role="presentation"><button type="button" role="tab" id="workspace-tab-${r}" aria-controls="content" aria-selected="${r===route}" tabindex="${r===route?'0':'-1'}" data-action="tab-open" data-id="${r}">${icon(navs.find(n=>n[0]===r)[1])}<span>${workspaceTitle(r)}</span></button>${r==='dashboard'?'':`<button type="button" class="tab-close" data-action="tab-close" data-id="${r}" aria-label="关闭${workspaceTitle(r)}标签">${icon('close')}</button>`}</div>`).join('')}</div><button class="workspace-close-others" data-action="tabs-close-others" aria-label="关闭其他标签" title="保留首页与当前页面" ${w.tabs.every(r=>r==='dashboard'||r===route)?'disabled':''}>${icon('close')}<span>关闭其他</span></button></div>`;
}
function backPage(){
 const w=workspace();
 if(w.trail.length<2)return;
 w.trail.pop();
 go(w.trail.at(-1),{replace:true});
}
function closeTab(r){
 const w=workspace();
 if(r==='dashboard'||!w.tabs.includes(r))return;
 w.tabs=w.tabs.filter(t=>t!==r);
 w.trail=w.trail.filter(t=>t!==r);
 delete w.scrolls[r];
 if(r===route)go(w.trail.at(-1)||w.tabs.at(-1)||'dashboard',{replace:true});
 else render();
}
function closeOtherTabs(){
 const w=workspace();
 w.tabs=w.tabs.filter(r=>r==='dashboard'||r===route);
 w.trail=w.trail.filter(r=>w.tabs.includes(r));
 render();
}
function revealActiveTab(){
 const strip=$('.workspace-tabs'),tab=$('.workspace-tab.active');
 if(!strip||!tab)return;
 const outer=strip.getBoundingClientRect(),inner=tab.getBoundingClientRect();
 if(inner.left<outer.left)strip.scrollLeft-=outer.left-inner.left;
 if(inner.right>outer.right)strip.scrollLeft+=inner.right-outer.right;
}
restoreWorkspace();
if(!location.hash)route=workspace().current;
if(!allowed().includes(route))route='dashboard';
if(location.hash!=='#'+route)history.replaceState(null,'','#'+route);
// A directly opened inner page can always return to the workbench.
if(!workspace().trail.length&&route!=='dashboard')workspace().trail.push('dashboard');

function commit(next,message){try{validateState(next);localStorage.setItem(KEY,JSON.stringify(next));state=next;render();if(message)toast(message);return true}catch(e){toast('保存失败：'+(e.name==='QuotaExceededError'?'浏览器缓存空间不足，请先导出备份':e.message));return false}}
const copyState=()=>JSON.parse(JSON.stringify(state));
function toast(msg){clearTimeout(toastTimer);$('#toast').textContent=msg;$('#toast').classList.add('show');toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),3500)}
const avatar=(name,i=0)=>`<span class="avatar ${['','amber','green','purple'][i%4]}">${esc(String(name||'?').slice(-2))}</span>`;
const badge=(s,c='')=>`<span class="badge ${c}">${esc(s)}</span>`;
const btn=(text,action,ic='',cl='',id='')=>`<button class="btn ${cl}" data-action="${action}" ${id?`data-id="${esc(id)}"`:''}>${ic?icon(ic):''}${text}</button>`;
const linkBtn=(text,action,id='')=>`<button class="text-btn" data-action="${action}" ${id?`data-id="${esc(id)}"`:''}>${text}${icon('chevron')}</button>`;
function empty(title='还没有相关记录',text='新的成长故事，正等着被记录。'){return `<div class="empty">${icon('leaf')}<h3>${title}</h3><p>${text}</p></div>`}
function stat(label,value,unit,ic,foot){return `<div class="stat"><div class="stat-top">${label}${icon(ic,'stat-icon')}</div><div class="stat-value">${value}<small>${unit}</small></div><div class="stat-foot">${foot}</div></div>`}
function heading(eyebrow,title,sub,action=''){return `<div class="page-title"><div><div class="eyebrow">${eyebrow}</div><h1>${title}</h1><p>${sub}</p></div>${action||`<div class="date-chip">${icon('calendar')}${longDate(today())}</div>`}</div>`}
function titleFor(){return workspaceTitle(route)}
function render(){
 if(!loggedIn){renderLogin();return}
 if(!allowed().includes(route))route='dashboard';
 rememberWorkspace();
 document.title='国际人成长中心 · '+titleFor();
 $('#app').innerHTML=`<button class="mobile-overlay" aria-label="关闭导航" data-action="menu"></button><aside class="sidebar"><a class="brand" href="#dashboard"><img src="${BRAND.mascot}" alt="国际人云小猴 Logo"><div class="brand-name">国际人成长中心<small>GROW WITH CURIOSITY</small></div></a><div class="sidebar-nav">${groupedNav()}</div><div class="sidebar-bottom"><div class="sidebar-note"><strong>每一份好奇，都值得被看见。</strong><br>在陪伴中探索，在探索中成长。</div><div class="sidebar-footer">GUO JI REN · GROWTH CENTER</div></div></aside><main class="main"><header class="topbar"><button class="circle-btn mobile-menu" data-action="menu" aria-label="打开导航">${icon('menu')}</button><div class="breadcrumb"><a href="#dashboard" aria-label="返回成长工作台">成长中心</a>${icon('chevron')}<strong>${titleFor()}</strong></div><div class="top-actions">${!family()?`<form class="searchbox" id="global-search">${icon('search')}<input name="q" placeholder="搜索学员姓名…" aria-label="搜索学员姓名"><kbd>↵</kbd></form>`:''}<button class="circle-btn" data-action="fullscreen" aria-label="切换全屏">${icon('full')}</button><select class="role-select" id="role-select" aria-label="切换工作视角">${Object.entries(roleName).map(([v,n])=>`<option value="${v}" ${role===v?'selected':''}>${n}</option>`).join('')}</select><button class="profile" data-action="account" aria-label="账号信息">${avatar(role==='admin'?'校长':role==='teacher'?'老师':role==='parent'?'家长':'学员')}<span>${role==='admin'?'管理员':role==='teacher'?'李老师':role==='parent'?'林小满家长':'林小满'}<small>${roleName[role]}</small></span></button></div></header>${workspaceBar()}<div class="content" id="content" role="tabpanel" aria-labelledby="workspace-tab-${route}">${(moduleViews[route]||{dashboard:dashboard,students:studentsPage,classes:classesPage,schedule:schedulePage,trials:trialsPage,enrollments:enrollmentsPage,growth:growthPage,settings:settingsPage}[route])()}<footer class="footer"><span>国际人成长中心 · 让每一份好奇，都长成自己的光</span></footer></div></main>`;
 revealActiveTab();
}
function dashboard(){if(family())return childDashboard();const low=activeStudents().filter(s=>s.remaining<=4), upcoming=scopedLessons().filter(l=>l.date===today()&&!l.cancelled).sort((a,b)=>a.time.localeCompare(b.time));
 return heading('A LITTLE PROGRESS, EVERY DAY','成长工作台','你好，'+(role==='teacher'?'李老师':'管理员')+'。今天也一起，发现成长的闪光时刻。')+
 `<section class="hero"><div class="hero-copy"><div class="hero-kicker">陪伴成长，不止于课堂</div><h2>把每一步成长，都照顾好。</h2><p>记录进步的点滴，让热爱生根，让好奇发芽。</p>${btn('查看今日课程','today','arrow')}</div><span class="hero-star">✧</span><span class="hero-doodle"></span><img class="hero-mascot" src="${BRAND.mascot}" alt="国际人云小猴"></section>`+
 `<section class="stats" aria-label="运营概览">${stat('在读学员',activeStudents().filter(s=>s.status==='在读').length,'位','users','<span>一起成长</span> 每一个名字都值得记住')}${stat('今日课程',upcoming.length,'节','calendar',`<span>${upcoming.filter(l=>l.checked).length} 节已完成</span> 准备迎接今天的好奇`) }${stat('待跟进试听',state.trials.filter(t=>['待联系','待试听'].includes(t.status)).length,'位','spark','新的相遇，从一次体验开始')}${stat('课时提醒',low.length,'位','clock','剩余课时 ≤ 4，记得温柔提醒')}</section>`+
 `<section class="grid-main"><div class="card"><div class="card-head"><div><h2>今日课程 ${badge(upcoming.length+' 节')}</h2><div class="sub">${longDate(today())}</div></div>${linkBtn('全部课表','schedule')}</div>${upcoming.length?upcoming.map(lessonRow).join(''):empty('今天暂时没有课程','把空闲留给备课，也留给新的灵感。')}<div class="card-foot">认真对待每一堂课，也看见每一个孩子。</div></div><div class="card"><div class="card-head"><div><h2>成长的闪光时刻</h2><div class="sub">让每一点进步，都被看见</div></div>${linkBtn('更多','growth')}</div><div class="notes">${state.notes.filter(n=>role!=='teacher'||cls(stu(n.studentId)?.classId)?.teacher==='李老师').slice().reverse().sort((a,b)=>b.date.localeCompare(a.date)).slice(0,3).map(noteRow).join('')||empty()}</div></div></section>`+
 `<div class="quick-actions">${canEdit()?`<button class="quick-action" data-action="student-new">${icon('users')}新学员建档 ${icon('plus')}</button><button class="quick-action" data-action="trial-new">${icon('spark')}预约体验课 ${icon('plus')}</button>`:`<button class="quick-action" data-action="students">${icon('users')}查看我的学员</button><button class="quick-action" data-action="classes">${icon('book')}查看班级</button>`}<button class="quick-action" data-action="note-new">${icon('leaf')}写一条成长记录 ${icon('plus')}</button><button class="quick-action" data-action="low-hours">${icon('clock')}查看课时提醒 ${icon('arrow')}</button></div>`;
}
function lessonRow(l){const c=cls(l.classId);return `<div class="lesson"><div class="lesson-time">${esc(l.time)}<small>${l.duration} 分钟</small></div><div class="lesson-line"></div><div class="lesson-info"><h3>${esc(c?.name)}</h3><p><span>${icon('users')}${esc(l.teacher||c?.teacher)}</span><span>${icon('pin')}${esc(l.room||c?.room)}</span></p></div>${l.checked?badge('已结课','green'):canTeach()?btn('课堂签到','attendance','', '',l.id):badge('待上课')}</div>`}
function noteRow(n,i){const s=stu(n.studentId);return `<div class="note">${avatar(s?.name,i)}<div class="note-copy"><div class="note-title"><span>${esc(s?.name)} ${esc(n.tag)}</span><time>${n.date===today()?'今天':dayLabel(n.date)}</time></div><p>${esc(n.content)}</p><div class="note-tag">${esc(n.teacher)} · ${esc(cls(s?.classId)?.subject)}</div></div></div>`}
function studentRows(){let a=activeStudents().filter(s=>(s.name+s.parent+s.grade+s.id+(s.code||'')).toLowerCase().includes(studentSearch.toLowerCase()));if(studentClass)a=a.filter(s=>s.classId===studentClass);if(studentStatus)a=a.filter(s=>studentStatus==='low'?s.remaining<=4:s.status===studentStatus);return a}
function studentTable(){let list=studentRows();return list.length?`<div class="table-wrap"><table><thead><tr><th>学员</th><th>在读班级</th><th>课时余量</th><th>家长 / 联系人</th><th>状态</th><th>操作</th></tr></thead><tbody>${list.map((s,i)=>`<tr><td><div class="person">${avatar(s.name,i)}<span>${esc(s.name)}<small>${esc(s.grade)} · ${esc(s.code||s.id)}</small></span></div></td><td>${esc(cls(s.classId)?.name)}</td><td><span class="${s.remaining<=4?'':''}" style="color:${s.remaining<=4?'#bd995f':'#6e92a8'}">${s.remaining}</span><span class="small muted"> / ${s.total} 课时</span><div class="progress"><span style="width:${s.total?Math.min(100,s.remaining/s.total*100):0}%;${s.remaining<=4?'background:#dfc38b':''}"></span></div></td><td>${esc(s.parent)}<br><span class="small muted">${esc(s.phone||'暂未填写')}</span></td><td>${badge(s.status,s.status==='在读'?'green':'amber')}</td><td><div class="row-actions">${linkBtn('档案','student-view',s.id)}${canEdit()?`<button class="text-btn" data-action="student-edit" data-id="${esc(s.id)}">编辑</button>`:''}</div></td></tr>`).join('')}</tbody></table></div><div class="pagination"><span>共 ${list.length} 位学员 · 全部展示</span><span class="page-number">1</span></div>`:empty('没有找到这位学员','换一个关键词，或添加一位新学员。')}
function studentsPage(){return heading('EVERY CHILD MATTERS','学员管理','了解每一个孩子，陪伴每一段成长。',canEdit()?btn('添加学员','student-new','plus','primary'):'')+`<div class="card"><div class="toolbar"><label class="searchbox">${icon('search')}<input id="student-search" aria-label="搜索姓名、年级或家长" placeholder="搜索姓名、年级或家长…" value="${esc(studentSearch)}"></label><select id="student-class" class="filter" aria-label="按班级筛选"><option value="">全部班级</option>${scopedClasses().map(c=>`<option value="${esc(c.id)}" ${studentClass===c.id?'selected':''}>${esc(c.name)}</option>`).join('')}</select><select id="student-status" class="filter" aria-label="按学员状态筛选">${[['','全部状态'],['在读','在读'],['暂停','暂停'],['low','课时不足 ≤ 4']].map(([v,n])=>`<option value="${v}" ${studentStatus===v?'selected':''}>${n}</option>`).join('')}</select><span class="spacer"></span>${badge(activeStudents().length+' 位学员','gray')}</div><div id="student-table">${studentTable()}</div></div>`}
function classesPage(){return heading('LEARNING TOGETHER','班级管理','把相似的好奇心，聚到一起。',canEdit()?btn('新建班级','class-new','plus','primary'):'')+`<div class="cards-grid">${scopedClasses().map((c,i)=>{let members=activeStudents().filter(s=>s.classId===c.id);return `<article class="card class-card"><div class="class-top"><span class="class-icon">${icon('book')}</span>${badge(c.subject,['','amber','green'][i%3])}</div><h2>${esc(c.name)}</h2><p>${esc(c.description)}</p><div class="class-meta"><div><label>授课老师</label>${esc(c.teacher)}</div><div><label>上课教室</label>${esc(c.room)}</div><div><label>班级人数</label>${members.length} / ${c.capacity} 位</div><div><label>已排课程</label>${state.lessons.filter(l=>l.classId===c.id).length} 节</div></div><div class="class-footer"><div class="bubble-group">${members.slice(0,5).map((s,j)=>avatar(s.name,j)).join('')||badge('等待新同学','gray')}</div>${linkBtn('查看学员','class-students',c.id)}${canEdit()?`<button class="text-btn" data-action="class-edit" data-id="${esc(c.id)}">编辑</button>`:''}</div></article>`}).join('')}</div>`}
function weekStart(){let d=new Date(today()+'T12:00:00');return addDays(today(),-(d.getDay()+6)%7+weekOffset*7)}
function visibleLessons(){return scopedLessons().filter(l=>!l.cancelled&&(!family()||!(l.excludedStudentIds||[]).includes(child()?.id)))}
function schedulePage(){let start=weekStart(),list=visibleLessons().filter(l=>l.date===selectedDay).sort((a,b)=>a.time.localeCompare(b.time));return heading('A WEEK OF DISCOVERY','本周课表','把学习安排好，把成长留给每一天。',canEdit()?btn('添加课程','lesson-new','plus','primary'):'')+`<div class="tabs"><button data-action="week-prev">上一周</button><button data-action="week-current">本周</button><button data-action="week-next">下一周</button><span class="muted small" style="padding:7px">${dayLabel(start)} — ${dayLabel(addDays(start,6))}</span></div><div class="week-tabs">${Array.from({length:7},(_,i)=>{let d=addDays(start,i);return `<button class="day-tab ${d===selectedDay?'active':''}" data-action="day" data-id="${d}" aria-label="${d}" ${d===selectedDay?'aria-current="date"':''}><span>${['周一','周二','周三','周四','周五','周六','周日'][i]}${d===today()?' · 今':''}</span><strong>${Number(d.slice(-2))}</strong><span class="pin" style="opacity:${visibleLessons().some(l=>l.date===d)?1:0}"></span></button>`}).join('')}</div>${list.length?list.map(l=>{const c=cls(l.classId);return `<div class="schedule-day"><div>${esc(l.time)}</div><article class="schedule-card"><div><h3>${esc(l.topic)}</h3><p><span>${esc(c?.name)}</span><span>${esc(l.teacher||c?.teacher)} · ${esc(l.room||c?.room)}</span><span>${l.duration} 分钟</span></p></div>${l.checked?btn('查看签到','attendance','check','',l.id):canTeach()?btn('课堂签到','attendance','check','primary',l.id):badge('期待见面','green')}</article></div>`}).join(''):`<div class="card">${empty('这一天，留一点自由的空间','暂无课程安排。'+(canEdit()?'可以点击右上角添加课程。':''))}</div>`}`}
function trialsPage(){const list=state.trials.filter(t=>!trialStatus||t.status===trialStatus);return heading('NICE TO MEET YOU','试听跟进','一次小小的体验，一段成长的开始。',btn('预约体验课','trial-new','plus','primary'))+`<div class="tabs">${['','待联系','待试听','已试听','暂不考虑','已报名'].map(x=>`<button class="${trialStatus===x?'active':''}" data-action="trial-filter" data-id="${x}">${x||'全部试听'}</button>`).join('')}</div><div class="card">${list.length?`<div class="table-wrap"><table><thead><tr><th>体验学员</th><th>意向班级</th><th>试听日期</th><th>联系人</th><th>跟进状态</th><th>操作</th></tr></thead><tbody>${list.map((t,i)=>`<tr><td><div class="person">${avatar(t.name,i)}<span>${esc(t.name)}<small>${esc(t.grade)}</small></span></div></td><td>${esc(cls(t.classId)?.name)}</td><td>${esc(t.date)}</td><td>${esc(t.parent)}</td><td>${badge(t.status,t.status==='已报名'?'green':t.status==='待联系'?'amber':'')}</td><td><div class="row-actions"><button class="text-btn" data-action="trial-edit" data-id="${esc(t.id)}">跟进</button>${t.status!=='已报名'?linkBtn('转为学员','trial-convert',t.id):''}</div></td></tr>`).join('')}</tbody></table></div><div class="pagination">共 ${list.length} 条试听记录</div>`:empty('暂无这个状态的试听','新的相遇值得期待。')}</div>`}
function enrollmentsPage(){return heading('KEEP GROWING','报名缴费','让接下来的每一节课，都有清晰的安排。',btn('登记报名','enrollment-new','plus','primary'))+`<section class="stats">${stat('报名记录',state.enrollments.length,'笔','wallet','累计报名记录')}${stat('登记金额',money(state.enrollments.reduce((a,e)=>a+e.amount,0)),'元','chart','已登记的收款金额')}${stat('登记课时',state.enrollments.reduce((a,e)=>a+e.hours,0),'课时','clock','每次新登记都会增加学员课时')}${stat('可用课时',activeStudents().reduce((a,s)=>a+s.remaining,0),'课时','book','当前所有学员剩余课时')}</section><div class="card"><div class="table-wrap"><table><thead><tr><th>学员</th><th>报名班级</th><th>增加课时</th><th>登记金额</th><th>登记日期</th><th>类型</th></tr></thead><tbody>${state.enrollments.slice().reverse().map(e=>`<tr><td>${esc(stu(e.studentId)?.name)}</td><td>${esc(cls(e.classId)?.name)}</td><td>+ ${e.hours} 课时</td><td>¥ ${money(e.amount)}</td><td>${esc(e.date)}</td><td>${badge('已登记','green')}</td></tr>`).join('')}</tbody></table></div>${!state.enrollments.length?empty():''}<div class="card-foot">报名记录保存后，会更新对应学员的课时。</div></div>`}
function growthPage(){let notes=state.notes.filter(n=>family()?n.studentId===child()?.id:role!=='teacher'||cls(stu(n.studentId)?.classId)?.teacher==='李老师').slice().sort((a,b)=>b.date.localeCompare(a.date));return heading('SMALL STEPS, BIG GROWTH',family()?'成长足迹':'成长记录','认真记录的每一个瞬间，都会成为前行的力量。',canTeach()?btn('记录闪光时刻','note-new','plus','primary'):'')+`${notes.length?notes.map((n,i)=>`<article class="card note-card"><div class="note">${avatar(stu(n.studentId)?.name,i)}<div class="note-copy"><div class="note-title"><span class="strong">${esc(stu(n.studentId)?.name)} · ${esc(n.title)}</span>${badge(n.tag,['','amber','green'][i%3])}</div><p>${esc(n.content)}</p><div class="note-tag">${esc(n.teacher)} · ${esc(n.date)}${canTeach()?` · <button class="text-btn" data-action="note-edit" data-id="${esc(n.id)}">编辑记录</button>`:''}</div></div></div></article>`).join(''):`<div class="card">${empty('成长故事，等待落笔','完成一节课后，写下孩子今天的闪光时刻吧。')}</div>`}`}
function childDashboard(){const s=child();if(!s)return heading('GROW WITH LOVE','成长工作台','还没有关联的学员。')+empty();let notes=state.notes.filter(n=>n.studentId===s.id),lessons=visibleLessons().filter(l=>l.date>=today()&&!l.checked).sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));return heading('GROW WITH LOVE',role==='parent'?'看见孩子，每一天的成长':'你好，'+esc(s.name),'每一小步，都在走向更好的自己。')+`<div class="child-hero">${avatar(s.name)}<div><h2>${esc(s.name)}</h2><p>${esc(s.grade)} · ${esc(cls(s.classId)?.name)}</p></div>${badge('持续成长中','green')}</div><section class="hero"><div class="hero-copy"><div class="hero-kicker">每一份好奇，都值得被看见</div><h2>今天，也向前一小步。</h2><p>尽情提问，勇敢尝试。成长没有标准答案。</p>${btn('看看我的课表','schedule','arrow')}</div><img class="hero-mascot" src="${BRAND.mascot}" alt="云小猴陪你成长"></section><div class="stats">${stat('已学习',s.total-s.remaining,'课时','book','一点一滴，都算数')}${stat('剩余课时',s.remaining,'课时','clock','期待下一次的探索')}${stat('成长记录',notes.length,'条','leaf','每一个闪光时刻')}${stat('已签到课程',state.checkins.filter(c=>c.studentId===s.id&&c.present).length,'节','check','累计课堂签到记录')}</div><div class="grid-main"><div class="card"><div class="card-head"><h2>接下来的课程</h2>${linkBtn('全部','schedule')}</div>${lessons.slice(0,3).map(l=>`<div class="card-foot">${dayLabel(l.date)}</div>${lessonRow(l)}`).join('')||empty()}</div><div class="card"><div class="card-head"><h2>老师眼中的你</h2>${linkBtn('更多','growth')}</div><div class="notes">${notes.slice(-2).map(noteRow).join('')||empty()}</div></div></div>`}
function settingsPage(){return heading('DATA MANAGEMENT','数据管理','管理数据备份与学员档案，让每一份记录妥善留存。')+`<div class="setting-grid"><section class="card setting-card"><h2>数据备份</h2><p>导出一份完整备份，在需要时导入恢复。当前数据保存在此浏览器，换设备或清除浏览器数据前，请先导出备份。</p><div class="buttons">${btn('导出备份','export','download')}${canEdit()?btn('导入备份','import','upload'):''}</div></section><section class="card setting-card"><h2>数据恢复</h2><p>恢复初始数据前会自动保存当前快照，可撤销最近一次重置。</p><div class="buttons">${canEdit()?`${btn('恢复初始数据','reset','','danger')}${btn('撤销最近重置','undo-reset')}`:'<span class="small muted">请联系校区管理员管理数据。</span>'}</div></section><section class="card setting-card"><h2>已归档学员</h2><p>归档后隐藏学员，报名、签到和成长记录继续保留，需要时可以恢复。</p>${state.students.filter(s=>s.archived&&(role==='admin'||role==='teacher'&&cls(s.classId)?.teacher==='李老师'||family()&&s.id===child()?.id)).map(s=>`<div class="archive-row"><span>${esc(s.name)}</span>${canEdit()?linkBtn('恢复','restore-student',s.id):badge('已归档','gray')}</div>`).join('')||'<span class="small muted">目前没有归档学员。</span>'}</section></div>`}
function openModal(title,sub,content,actions=''){const d=$('#modal');$('#modal-body').innerHTML=`<div class="modal-head"><div><h2 id="modal-title">${title}</h2><p>${sub}</p></div><button class="circle-btn" aria-label="关闭窗口" data-action="modal-close">${icon('close')}</button></div>${content}${actions?`<div class="modal-actions">${actions}</div>`:''}`;if(!d.open)d.showModal();d.scrollTop=0}
function closeModal(){$('#modal').close()}
function field(name,label,value='',type='text',opts={}){let val=esc(value),control;if(type==='select')control=`<select name="${name}" ${opts.required?'required':''}>${opts.options.map(o=>{let [v,n]=Array.isArray(o)?o:[o,o];return `<option value="${esc(v)}" ${String(value)===String(v)?'selected':''}>${esc(n)}</option>`}).join('')}</select>`;else if(type==='textarea')control=`<textarea name="${name}" maxlength="2000" ${opts.required?'required':''}>${val}</textarea>`;else control=`<input name="${name}" type="${type}" value="${val}" ${opts.required?'required':''} ${type==='number'?`min="${opts.min??0}" max="${opts.max??99999}" step="${opts.step??1}"`:'maxlength="100"'}>`;return `<label class="field ${opts.full?'full':''}">${label}${opts.required?' *':''}${control}${opts.hint?`<small>${opts.hint}</small>`:''}</label>`}
function formModal(type,title,fields,id='',extra={}){openModal(title,'把重要的信息，认真记下来。',`<form id="record-form" data-type="${type}" data-id="${esc(id)}" data-trial="${esc(extra.trial||'')}"><div class="modal-content"><div class="form-grid">${fields}</div><div id="form-error" class="form-error" role="alert"></div></div><div class="modal-actions">${btn('取消','modal-close')}<button type="submit" class="btn primary">${icon('check')}保存${type==='enrollment'?'并增加课时':''}</button></div></form>`)}
const classOptions=()=>scopedClasses().map(c=>[c.id,c.name]);
const studentOptions=()=>activeStudents().map(s=>[s.id,s.name]);
const required={required:true};
function studentForm(id='',trialId=''){const s=stu(id)||state.trials.find(t=>t.id===trialId)||{};formModal('student',id?'编辑学员档案':trialId?'试听转为学员':'欢迎一位新同学',field('name','学员姓名',s.name||'','text',required)+field('grade','所在年级',s.grade||'七年级','select',{options:['一年级','二年级','三年级','四年级','五年级','六年级','七年级','八年级','九年级','其他']})+field('parent','家长 / 联系人',s.parent||'','text',required)+field('phone','联系电话（选填）',s.phone||'','tel')+field('classId','在读班级',s.classId||state.classes[0]?.id,'select',{options:classOptions(),required:true})+field('status','学习状态',s.status==='暂停'?'暂停':'在读','select',{options:['在读','暂停']})+(id?'':field('hours','初始课时',0,'number',{hint:'之后可在报名缴费中增加课时。',max:1000}))+field('remark','学员备注',s.remark||'','textarea',{full:true}),id,{trial:trialId})}
function classForm(id=''){let c=cls(id)||{};formModal('class',id?'编辑班级':'组建一个新班级',field('name','班级名称',c.name||'','text',{required:true,full:true})+field('subject','课程方向',c.subject||'初中数学','text',required)+field('teacher','授课老师',c.teacher||'李老师','text',required)+field('room','上课教室',c.room||'向阳教室','text',required)+field('capacity','班级容量',c.capacity||12,'number',{min:1,max:100,required:true})+field('description','一句话介绍',c.description||'','textarea',{full:true}),id)}
function lessonForm(){formModal('lesson','安排一堂有趣的课',field('topic','课程主题','','text',{required:true,full:true})+field('classId','授课班级',state.classes[0]?.id,'select',{options:classOptions(),required:true})+field('date','上课日期',selectedDay,'date',required)+field('time','开始时间','17:00','time',required)+field('duration','时长（分钟）',90,'number',{min:15,max:240,step:15,required:true}))}
function trialForm(id=''){let t=state.trials.find(x=>x.id===id)||{};formModal('trial',id?'更新试听进展':'预约一次新体验',field('name','学员姓名',t.name||'','text',required)+field('grade','所在年级',t.grade||'七年级','text',required)+field('parent','家长 / 联系人',t.parent||'','text',required)+field('phone','联系电话（选填）',t.phone||'','tel')+field('classId','意向班级',t.classId||state.classes[0]?.id,'select',{options:classOptions(),required:true})+field('date','试听日期',t.date||today(),'date',required)+field('status','跟进状态',t.status||'待联系','select',{options:t.status==='已报名'?['已报名']:['待联系','待试听','已试听','暂不考虑']})+field('remark','沟通备注',t.remark||'','textarea',{full:true}),id)}
function enrollmentForm(){if(!activeStudents().length){toast('请先添加一位学员');return}formModal('enrollment','登记一份新的学习计划',field('studentId','学员',activeStudents()[0].id,'select',{required:true,options:studentOptions()})+field('hours','增加课时',24,'number',{required:true,min:1,max:1000})+field('amount','登记金额（元）',2880,'number',{required:true,min:0,max:1000000,step:.01})+field('date','登记日期',today(),'date',required)+`<div class="hint field full" style="margin:0">登记收款信息，保存后同步增加该学员的总课时和剩余课时。</div>`)}
function noteForm(id=''){if(!activeStudents().length){toast('请先添加一位学员');return}let n=state.notes.find(x=>x.id===id)||{};formModal('note',id?'修改成长记录':'记录一个闪光时刻',field('studentId','学员',n.studentId||activeStudents()[0].id,'select',{options:studentOptions(),required:true})+field('tag','成长标签',n.tag||'自信表达','select',{options:['自信表达','独立思考','探索精神','专注投入','合作互助','学习进步']})+field('title','这次成长的标题',n.title||'','text',{required:true,full:true})+field('content','我看见的成长',n.content||'','textarea',{required:true,full:true})+field('teacher','记录老师',n.teacher||'李老师','text',required)+field('date','记录日期',n.date||today(),'date',required),id)}
function studentView(id){let s=stu(id);if(!s)return;openModal('学员档案','每一个孩子，都有自己的成长节奏。',`<div class="modal-content"><div class="child-hero" style="margin:0;border:0;padding:0">${avatar(s.name)}<div><h2>${esc(s.name)}</h2><p>${esc(s.grade)}</p></div>${badge(s.status,'green')}</div><div class="detail-kv"><div><label>班级</label>${esc(cls(s.classId)?.name)}</div><div><label>联系人</label>${esc(s.parent)}</div><div><label>剩余 / 总课时</label>${s.remaining} / ${s.total}</div><div><label>联系电话</label>${esc(s.phone||'暂未填写')}</div></div><div class="detail-notes">${esc(s.remark||'还没有备注，期待更多了解。')}</div></div>`,canEdit()?`${btn('归档学员','archive-student','archive','',s.id)}${btn('编辑档案','student-edit','edit','primary',s.id)}`:btn('关闭','modal-close'))}
function attendance(id){let l=state.lessons.find(x=>x.id===id);if(!l)return;let c=cls(l.classId),members=activeStudents().filter(s=>s.classId===c.id&&s.status==='在读');if(l.checked){const checks=state.checkins.filter(x=>x.lessonId===id);openModal('课堂签到记录',`${esc(c.name)} · ${esc(l.date)} ${esc(l.time)}`,`<div class="modal-content"><div class="hint">本节课已完成签到，课时只扣减一次。</div>${checks.map(x=>`<div class="attendance-row"><span>${esc(stu(x.studentId)?.name)}</span>${badge(x.present?'已到 · 扣 1 课时':'请假 / 未到',x.present?'green':'amber')}</div>`).join('')}</div>`,btn('关闭','modal-close'));return}if(!canTeach())return;openModal('今天，我们一起上课',`${esc(c.name)} · ${esc(l.date)} ${esc(l.time)}`,`<form id="attendance-form" data-id="${esc(id)}"><div class="modal-content"><div class="hint">勾选到课学员。确认后，每位到课学员扣减 1 课时；未勾选不扣课时。本节课只能结算一次。</div>${members.map((s,i)=>`<div class="attendance-row"><label><input type="checkbox" name="present" value="${esc(s.id)}" ${s.remaining>0?'checked':'disabled'}>${avatar(s.name,i)}${esc(s.name)}</label><small>剩余 ${s.remaining} 课时${s.remaining===0?' · 请先续费':''}</small></div>`).join('')||empty('这个班级还没有在读学员','添加学员后再来签到。')}</div><div class="modal-actions">${btn('取消','modal-close')}<button class="btn primary" type="submit" ${!members.length?'disabled':''}>${icon('check')}确认签到并结课</button></div></form>`)}
function saveForm(form){let type=form.dataset.type,id=form.dataset.id,d=Object.fromEntries(new FormData(form)),next=copyState();for(let k of Object.keys(d))d[k]=d[k].trim();if(type==='note'?!canTeach():!canEdit())return toast('当前身份不能执行这项操作');try{
 const num=(v,min,max)=>{let n=Number(v);if(!Number.isFinite(n)||n<min||n>max)throw Error('请检查数字范围');return n};
 const need=(...keys)=>{if(keys.some(k=>!d[k]))throw Error('请填写所有必填信息')};
 if(type==='student'){need('name','parent','classId');let target=cls(d.classId);if(!target)throw Error('请选择有效班级');if(activeStudents().filter(s=>s.classId===target.id&&s.id!==id).length>=target.capacity)throw Error('该班级已满，请先调整班级容量');if(id){let s=next.students.find(s=>s.id===id);Object.assign(s,d)}else{let hours=num(d.hours,0,1000);next.students.push({id:uid('s'),name:d.name,grade:d.grade,parent:d.parent,phone:d.phone,classId:d.classId,status:d.status,remark:d.remark,total:hours,remaining:hours,created:today()});if(form.dataset.trial){let t=next.trials.find(t=>t.id===form.dataset.trial);if(t)t.status='已报名'}}}
 if(type==='class'){need('name','teacher','room');d.capacity=num(d.capacity,1,100);if(d.capacity<activeStudents().filter(s=>s.classId===id).length)throw Error('班级容量不能少于现有学员数');if(id)Object.assign(next.classes.find(c=>c.id===id),d);else next.classes.push({id:uid('c'),...d})}
 if(type==='lesson'){need('topic','classId','date','time');d.duration=num(d.duration,15,240);const c=cls(d.classId);if(!c)throw Error('班级不存在');const minutes=t=>Number(t.slice(0,2))*60+Number(t.slice(3));let begin=minutes(d.time);if(begin+d.duration>1440)throw Error('课程不能跨越当天结束时间');if(next.lessons.some(l=>l.date===d.date&&(l.classId===d.classId||cls(l.classId)?.room===c.room||cls(l.classId)?.teacher===c.teacher)&&begin<minutes(l.time)+l.duration&&begin+d.duration>minutes(l.time)))throw Error('这个时间段的班级、老师或教室已有课程，请调整时间');next.lessons.push({id:uid('l'),...d,checked:false});selectedDay=d.date;let mon=addDays(today(),-(new Date(today()+'T12:00:00').getDay()+6)%7);weekOffset=Math.floor((new Date(d.date+'T12:00:00')-new Date(mon+'T12:00:00'))/86400000/7)}
 if(type==='trial'){need('name','parent','classId','date');if(id)Object.assign(next.trials.find(t=>t.id===id),d);else next.trials.push({id:uid('t'),...d})}
 if(type==='enrollment'){need('studentId','date');let s=next.students.find(s=>s.id===d.studentId&&!s.archived);if(!s)throw Error('学员不存在');let hours=num(d.hours,1,1000),amount=num(d.amount,0,1000000);next.enrollments.push({id:uid('e'),studentId:s.id,classId:s.classId,hours,amount,date:d.date,method:'收款登记'});s.total+=hours;s.remaining+=hours}
 if(type==='note'){need('title','content','studentId','teacher','date');if(id)Object.assign(next.notes.find(n=>n.id===id),d);else next.notes.push({id:uid('n'),...d})}
 if(commit(next,type==='enrollment'?'报名已登记，学员课时已增加':'已保存，成长的点滴不会丢失'))closeModal();
 }catch(e){$('#form-error').textContent=e.message}}
function saveAttendance(form){if(!canTeach())return;let next=copyState(),l=next.lessons.find(x=>x.id===form.dataset.id);if(l.checked){closeModal();toast('这节课已经签到过了');return}let selected=new Set(new FormData(form).getAll('present'));const members=next.students.filter(s=>!s.archived&&s.classId===l.classId&&s.status==='在读');for(const s of members){const present=selected.has(s.id);if(present&&s.remaining<1){toast(s.name+'的课时不足');return}if(present)s.remaining-=1;next.checkins.push({lessonId:l.id,studentId:s.id,present,date:today()})}l.checked=true;if(commit(next,'签到完成，到课学员已扣减 1 课时'))closeModal()}
function accountModal(){openModal('账号与工作视角','选择需要查看的工作内容。',`<div class="modal-content"><div class="account-details">当前账号 <strong>demo</strong><br>当前身份 <strong>${roleName[role]}</strong></div><div class="choice-group">${Object.entries(roleName).map(([v,n])=>btn(n,'role','users',role===v?'active':'',v)).join('')}</div></div>`,btn('退出登录','logout','logout'))}
function setRole(v){
 if(!roleName[v])return;
 workspace().scrolls[route]=window.scrollY;
 rememberWorkspace();
 role=v;
 restoreModuleWorkspace();
 try{sessionStorage.setItem(KEY+':role',v)}catch{}
 restoreWorkspace();
 route=workspace().current;
 closeModal();
 go(route,{replace:true});
 toast('已切换为'+roleName[v]);
}
function renderLogin(){$('#app').innerHTML=`<main class="login"><section class="login-card"><div class="login-logo"><img src="${BRAND.mascot}" alt="国际人云小猴"><h1>国际人成长中心</h1><p>让每一份好奇，都长成自己的光。</p></div><form id="login-form"><div class="form-grid">${field('username','账号','demo','text',{required:true,full:true})}${field('password','密码','demo123','password',{required:true,full:true})}</div><button class="btn primary" type="submit">进入成长工作台 ${icon('arrow')}</button><p class="small muted" style="text-align:center;margin-top:18px">账号已填好，点击即可进入</p></form></section></main>`}
function go(r,{replace=false,fromBrowser=false}={}){
 if(!allowed().includes(r))r='dashboard';
 const w=workspace();
 w.scrolls[route]=window.scrollY;
 route=r;
 if(location.hash!=='#'+r&&!fromBrowser)history[replace?'replaceState':'pushState'](null,'','#'+r);
 document.body.classList.remove('mobile-open');
 render();
 window.scrollTo(0,Number.isFinite(w.scrolls[r])?w.scrolls[r]:0);
}
const actions={
 'page-back':backPage,'tab-open':go,'tab-close':closeTab,'tabs-close-others':closeOtherTabs,
 'menu':()=>document.body.classList.toggle('mobile-open'),'modal-close':closeModal,'account':accountModal,'role':setRole,'logout':()=>{closeModal();loggedIn=false;renderLogin()},
 'fullscreen':async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen()}catch{toast('当前浏览器不支持全屏，可在独立浏览器窗口打开')}},
 'student-new':()=>canEdit()&&studentForm(),'student-edit':id=>canEdit()&&studentForm(id),'student-view':studentView,'class-new':()=>canEdit()&&classForm(),'class-edit':id=>canEdit()&&classForm(id),
 'lesson-new':()=>canEdit()&&lessonForm(),'trial-new':()=>canEdit()&&trialForm(),'trial-edit':id=>canEdit()&&trialForm(id),'trial-convert':id=>canEdit()&&studentForm('',id),'note-new':()=>canTeach()&&noteForm(),'note-edit':id=>canTeach()&&noteForm(id),'enrollment-new':()=>canEdit()&&enrollmentForm(),'attendance':attendance,
 'class-students':id=>{studentSearch='';studentClass=id;studentStatus='';go('students')},'low-hours':()=>{studentSearch='';studentClass='';studentStatus='low';go('students')},'today':()=>{selectedDay=today();weekOffset=0;go('schedule')},
 'week-prev':()=>{weekOffset--;selectedDay=weekStart();render()},'week-next':()=>{weekOffset++;selectedDay=weekStart();render()},'week-current':()=>{weekOffset=0;selectedDay=today();render()},'day':d=>{selectedDay=d;render()},'trial-filter':s=>{trialStatus=s;render()},
 'archive-student':id=>{if(!canEdit())return;openModal('归档这位学员？','记录会保留，稍后可以在数据管理中恢复。',`<div class="modal-content"><p>将归档 ${esc(stu(id)?.name)}，并从学员列表与签到名单中隐藏。</p></div>`,btn('取消','modal-close')+btn('确认归档','archive-confirm','archive','danger',id))},
 'archive-confirm':id=>{if(!canEdit())return;let n=copyState();n.students.find(s=>s.id===id).archived=true;if(commit(n,'已归档，可以在数据管理中恢复'))closeModal()},
 'restore-student':id=>{if(!canEdit())return;let n=copyState(),s=n.students.find(s=>s.id===id);if(activeStudents().filter(x=>x.classId===s.classId).length>=cls(s.classId).capacity)return toast('原班级已满，请先增加班级容量');s.archived=false;commit(n,'学员已恢复')},
 'export':()=>{let data=family()?{version:1,exportType:'family-view',student:child(),notes:state.notes.filter(n=>n.studentId===child()?.id),lessons:visibleLessons()}:role==='teacher'?{version:1,exportType:'teacher-view',students:activeStudents(),classes:scopedClasses(),lessons:scopedLessons(),notes:scopedRows('notes'),checkins:state.checkins.filter(c=>scopedLessons().some(l=>l.id===c.lessonId))}:state;let blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='国际人成长中心-'+(family()?'成长记录-':'数据备份-')+today()+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),2000);toast(family()?'成长记录已导出':'备份已导出')},
 'import':()=>canEdit()&&$('#import-file').click(),
 'reset':()=>{if(!canEdit())return;openModal('恢复初始数据？','当前数据会自动留存一份重置快照。',`<div class="modal-content"><p class="muted small">恢复后，学员、课表和记录将回到初始数据。你可以使用“撤销最近重置”找回现在的数据。</p></div>`,btn('取消','modal-close')+btn('恢复初始数据','reset-confirm','','danger'))},
 'reset-confirm':()=>{if(!canEdit())return;try{localStorage.setItem(BACKUP,JSON.stringify(state));studentSearch='';studentClass='';studentStatus='';if(commit(seed(),'初始数据已恢复，原数据快照已保留'))closeModal()}catch{toast('快照保存失败，未重置数据')}},
 'undo-reset':()=>{if(!canEdit())return;try{let raw=localStorage.getItem(BACKUP);if(!raw)return toast('还没有可恢复的重置快照');const prev=validateState(JSON.parse(raw)),current=JSON.stringify(state);if(commit(prev,'已恢复上一次快照'))localStorage.setItem(BACKUP,current)}catch{toast('快照无法读取')}},
 'import-confirm':()=>{if(!canEdit()||!pendingImport)return;try{localStorage.setItem(BACKUP,JSON.stringify(state));if(commit(pendingImport,'备份已导入，原数据快照已保留')){pendingImport=null;closeModal()}}catch{toast('备份保存失败，未替换数据')}}
};
let pendingImport=null;
document.addEventListener('click',e=>{const b=e.target.closest('[data-action]');if(b){const a=b.dataset.action;if(actions[a])actions[a](b.dataset.id||'');else if(allowed().includes(a))go(a)}const a=e.target.closest('a[href^="#"]');if(a&&!e.ctrlKey&&!e.metaKey&&!e.shiftKey&&!e.altKey&&e.button===0){e.preventDefault();go(a.getAttribute('href').slice(1))}});
document.addEventListener('submit',e=>{e.preventDefault();if(e.target.id==='record-form')saveForm(e.target);if(e.target.id==='attendance-form')saveAttendance(e.target);if(e.target.id==='global-search'){studentSearch=new FormData(e.target).get('q').trim();studentClass='';studentStatus='';go('students')}if(e.target.id==='login-form'){const d=new FormData(e.target);if(d.get('username')==='demo'&&d.get('password')==='demo123'){loggedIn=true;role='admin';go('dashboard');toast('欢迎回到成长中心')}else toast('账号为 demo，密码为 demo123')}});
document.addEventListener('input',e=>{if(e.target.id==='student-search'){studentSearch=e.target.value;$('#student-table').innerHTML=studentTable();rememberWorkspace()}});
document.addEventListener('change',e=>{if(e.target.id==='role-select')setRole(e.target.value);if(e.target.id==='student-class'){studentClass=e.target.value;$('#student-table').innerHTML=studentTable();rememberWorkspace()}if(e.target.id==='student-status'){studentStatus=e.target.value;$('#student-table').innerHTML=studentTable();rememberWorkspace()}});
$('#import-file').addEventListener('change',async e=>{const file=e.target.files[0];e.target.value='';if(!file)return;if(file.size>5*1024*1024)return toast('请选择小于 5 MB 的备份文件');try{pendingImport=validateState(JSON.parse(await file.text()));openModal('导入这份备份？',`${pendingImport.students.length} 位学员 · ${pendingImport.classes.length} 个班级`, '<div class="modal-content"><p class="small muted">将替换当前浏览器中的数据。导入前会保存当前数据快照，可在数据管理中恢复。</p></div>',btn('取消','modal-close')+btn('确认导入','import-confirm','upload','primary'))}catch(e){pendingImport=null;toast('导入失败：'+e.message)}});
window.addEventListener('hashchange',()=>go(location.hash.slice(1)||'dashboard',{fromBrowser:true}));
window.addEventListener('storage',e=>{if(e.key===KEY&&e.newValue){try{state=validateState(JSON.parse(e.newValue));closeModal();render();toast('已同步另一个标签页的修改')}catch{toast('其他标签页的数据无法读取')}}});
window.addEventListener('pagehide',()=>{workspace().scrolls[route]=window.scrollY;rememberWorkspace()});
document.addEventListener('keydown',e=>{
 const active=e.target.closest('[role="tab"]');
 if(!active)return;
 const tabs=workspace().tabs,index=tabs.indexOf(active.dataset.id);
 let next;
 if(e.key==='ArrowRight')next=tabs[(index+1)%tabs.length];
 if(e.key==='ArrowLeft')next=tabs[(index-1+tabs.length)%tabs.length];
 if(e.key==='Home')next=tabs[0];
 if(e.key==='End')next=tabs.at(-1);
 if(next){e.preventDefault();go(next);document.getElementById('workspace-tab-'+next)?.focus()}
 if(e.key==='Delete'&&active.dataset.id!=='dashboard'){e.preventDefault();closeTab(active.dataset.id);document.getElementById('workspace-tab-'+route)?.focus()}
});
/*__MODULES__*/
render();if(storageWarning)toast(storageWarning);
