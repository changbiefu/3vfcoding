/* Browser-independent business rules, adapted from app/backend/controller/edu.
 * All mutations are applied to a copy and committed atomically by the UI. */
const Domain = (() => {
 const round = n => Math.round((n + Number.EPSILON) * 100) / 100;
 const fail = message => { throw Error(message); };
 const number = (v, min=0, max=1000000) => {const n=Number(v);if(v===''||!Number.isFinite(n)||n<min||n>max)fail('数值须在 '+min+' 至 '+max+' 之间');return round(n)};
 const find = (s,k,id) => s[k].find(x=>x.id===id)||fail('关联记录不存在');
 const id = p => p+'-'+crypto.randomUUID();
 const arrays=['courses','points','changes','adjustments','settlements','feeWarnings','warnings','resources','aids','contacts','staff','groups','members','memberGroups','memberLevels','attachments','attachGroups','blacklist','languages','configGroups','configItems','logs'];
 const date = () => {const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};
 function upgrade(s){
  // Normalize only the original preset labels; preserve all user-entered content.
  for(const x of s.groups||[])if(x.id==='group-admin'&&x.description==='管理所有演示业务')x.description='管理校区业务';
  for(const x of s.points||[])if(x.id.startsWith('point-seed-')&&x.reason==='示例：课堂积极参与')x.reason='课堂积极参与';
  for(const x of s.contacts||[])if(x.id==='contact-demo'&&x.remark==='虚构演示联系人')x.remark='教学咨询与课程服务';
  for(const x of s.enrollments||[])if(x.method==='演示收款')x.method='收款登记';
  for(const x of s.logs||[])if(x.operator==='演示账号')x.operator='管理员';
  if(s.extensionVersion===2)return s;
  const day=date();
  for(const k of arrays)if(!Array.isArray(s[k]))s[k]=[];
  if(!s.courses.length)s.courses=[...new Set(s.classes.map(c=>c.subject))].map((name,i)=>({id:'course-'+i,code:'KC00'+(i+1),name,category:'成长课程',hours:24,price:120,type:'常规课',level:'初级',status:'正常',description:''}));
  for(const [i,c] of s.classes.entries()){c.courseId??=s.courses.find(x=>x.name===c.subject)?.id||s.courses[0]?.id;c.code??='BJ00'+(i+1);c.totalHours??=24;c.weekday??='周六';c.start??='16:30';c.end??='18:00';c.status??='正常'}
  for(const [i,x] of s.students.entries()){x.code??='GJR'+String(i+1).padStart(5,'0');x.gender??='未填写';x.birthday??='';x.school??='';x.address??='';x.contractEnd??=''}
  for(const l of s.lessons){l.hours??=1;l.mode??='请假不扣课';l.teacher??=s.classes.find(c=>c.id===l.classId)?.teacher||'';l.room??=s.classes.find(c=>c.id===l.classId)?.room||''}
  for(const c of s.checkins){c.id??=id('check');c.deduct??=c.present?1:0;c.status??=c.present?'到课':'请假';c.remaining??=s.students.find(x=>x.id===c.studentId)?.remaining||0}
  for(const e of s.enrollments){e.gift??=0;e.payStatus??='已付款';e.status??='已完成';e.type??='续费报名';e.paid??=e.amount;e.applied??=true;e.legacy??=true}
  if(!s.staff.length)s.staff=[...new Set(s.classes.map(c=>c.teacher))].map((name,i)=>({id:'staff-'+i,name,username:'teacher'+(i+1),phone:'',email:'',role:'教师',status:'正常',price:100}));
  if(!s.groups.length)s.groups=[{id:'group-admin',name:'校区管理',description:'管理校区业务',routes:'全部',status:'正常'},{id:'group-teacher',name:'授课教师',description:'仅展示本人班级及教学工作',routes:'教学业务',status:'正常'}];
  if(!s.points.length)s.points=s.students.map((x,i)=>({id:'point-seed-'+i,studentId:x.id,amount:30+i*5,type:'收入',reason:'课堂积极参与',date:day}));
  if(!s.contacts.length)s.contacts=[{id:'contact-demo',name:'教学服务台',campus:'中心校区',position:'教务服务',phone:'',email:'',remark:'教学咨询与课程服务',status:'正常'}];
  if(!s.resources.length)s.resources=[{id:'resource-demo',name:'数学课堂观察记录模板',category:'教案模板',courseId:s.courses[0]?.id||'',teacher:s.staff[0]?.name||'',description:'记录本节目标、学员表现、课后跟进。',content:'课堂观察记录\n本节目标：\n重点问题：\n学生表现：\n课后跟进：\n',filename:'课堂观察记录.txt',downloads:0,date:day,status:'正常'}];
  if(!s.aids.length)s.aids=[{id:'aid-demo',name:'几何拼搭教具',quantity:2,teacher:s.staff[0]?.name||'',date:day,reason:'小组合作探究图形关系',status:'待审批',approval:''}];
  s.config??={campus:'中心校区',lowHours:4,absenceDays:30,hourPrice:100};
  s.extensionVersion=2;return s;
 }
 function validate(s){
  for(const k of arrays){if(!Array.isArray(s[k])||s[k].length>10000)fail(k+' 数据无效');const ids=new Set();for(const x of s[k]){if(!x||typeof x.id!=='string'||ids.has(x.id))fail(k+' 记录编号无效');ids.add(x.id)}}
  for(const x of s.students)if(!Number.isFinite(x.total)||!Number.isFinite(x.remaining)||x.remaining<0||x.total<x.remaining)fail('学员课时不能为负或超过总课时');
  for(const x of s.courses){number(x.hours,0,10000);number(x.price)}
  for(const x of s.points){find(s,'students',x.studentId);number(x.amount);if(!['收入','支出'].includes(x.type))fail('积分类型无效')}
  for(const x of s.students)if(balance(s,x.id)<0)fail(x.name+'的积分余额不足');
  for(const k of ['changes','feeWarnings'])for(const x of s[k])find(s,'students',x.studentId);
  for(const x of s.checkins){number(x.deduct??0,0,1000);if(x.remaining!=null)number(x.remaining,0,100000)}
  for(const x of s.settlements){number(x.finalAmount);number(x.finalHours,0,100000)}
  for(const k of ['resources','attachments'])for(const x of s[k])if(x.fileData&&(!/^data:[\w.+/-]*;base64,[A-Za-z0-9+/=\r\n]+$/.test(x.fileData)||x.fileData.length>850000))fail('附件数据格式或大小无效');
  for(const x of s.adjustments)if(!s.lessons.some(l=>l.id===x.lessonId))fail('调课关联课时不存在');
  return s;
 }
 function balance(s,studentId){return round(s.points.filter(x=>x.studentId===studentId).reduce((n,x)=>n+(x.type==='收入'?x.amount:-x.amount),0))}
 function hours(s,studentId,delta){const x=find(s,'students',studentId);if(x.remaining+delta<0||x.total+delta<0)fail(x.name+'剩余课时不足，不能撤销已使用课时');x.total=round(x.total+delta);x.remaining=round(x.remaining+delta)}
 function transfer(s,studentId,classId){const x=find(s,'students',studentId),c=find(s,'classes',classId);if(s.students.filter(y=>!y.archived&&y.classId===classId&&y.id!==x.id).length>=c.capacity)fail('目标班级已满');x.classId=classId}
 function enrollment(s,d,recordId){
  let old=recordId?find(s,'enrollments',recordId):null;
  if(old?.legacy)fail('初始历史报名保留为期初记录，请新建调整记录');
  if(old?.applied)hours(s,old.studentId,-(old.hours+old.gift));
  if(old?.oldClassId){if(find(s,'students',old.studentId).classId!==old.classId)fail('学员已有后续转班，请先处理后续异动');transfer(s,old.studentId,old.oldClassId)}
  const x={...d,id:recordId||id('enroll'),hours:number(d.hours,0.01,10000),gift:number(d.gift||0,0,10000),amount:number(d.amount),paid:number(d.paid||0),legacy:false};
  if(x.paid>x.amount)fail('实收金额不能大于应收金额');
  x.payStatus=x.paid===x.amount?'已付款':x.paid>0?'部分付款':'未付款';
  x.applied=['已报名','已完成'].includes(x.status);find(s,'classes',x.classId);const student=find(s,'students',x.studentId);
  if(x.applied){hours(s,x.studentId,x.hours+x.gift);if(x.classId!==student.classId){x.oldClassId=student.classId;transfer(s,x.studentId,x.classId)}}
  put(s,'enrollments',x);return x;
 }
 function put(s,k,x){const i=s[k].findIndex(r=>r.id===x.id);if(i<0)s[k].push(x);else s[k][i]=x;return x}
 function locked(s,l){return s.settlements.some(x=>['已确认','已发放'].includes(x.status)&&x.lessonIds.includes(l.id))}
 function undoAttendance(s,lessonId){const l=find(s,'lessons',lessonId);if(locked(s,l))fail('该课时已纳入确认结算单，须先作废结算单');for(const c of s.checkins.filter(c=>c.lessonId===l.id)){const x=find(s,'students',c.studentId);x.remaining=round(x.remaining+(c.deduct??(c.present?1:0)))}s.checkins=s.checkins.filter(x=>x.lessonId!==l.id);l.checked=false}
 function members(s,l){if(l.checked)return s.checkins.filter(x=>x.lessonId===l.id).map(x=>find(s,'students',x.studentId));return s.students.filter(x=>!x.archived&&x.status==='在读'&&(l.studentIds?l.studentIds.includes(x.id):x.classId===l.classId)&&!(l.excludedStudentIds||[]).includes(x.id))}
 function attendance(s,lessonId,values,actualHours,mode){const l=find(s,'lessons',lessonId);if(l.cancelled)fail('停课记录不能签到');const originalRoster=l.checked?members(s,l):null;if(l.checked)undoAttendance(s,l.id);l.hours=number(actualHours,0.01,24);l.mode=mode;
  const list=originalRoster||members(s,l);if(!list.length)fail('没有可签到学员');
  for(const x of list){const status=values[x.id]||'请假',present=['到课','补课','迟到','早退'].includes(status),deduct=mode==='全员扣课'||present?l.hours:0;if(x.remaining<deduct)fail(x.name+'剩余课时不足');x.remaining=round(x.remaining-deduct);s.checkins.push({id:id('check'),lessonId:l.id,studentId:x.id,date:l.date,present,status,deduct,remaining:x.remaining,remark:''})}l.checked=true;
 }
 function conflict(s,l,exclude=''){const c=find(s,'classes',l.classId),minute=t=>+t.slice(0,2)*60+(+t.slice(3));if(!/^\d{4}-\d{2}-\d{2}$/.test(l.date)||!/^\d{2}:\d{2}$/.test(l.time))fail('请填写日期和时间');const start=minute(l.time),end=start+number(l.duration,15,240);if(end>1440)fail('课程不能跨越当天');for(const o of s.lessons){if(o.id===exclude||o.cancelled||o.date!==l.date)continue;const oc=find(s,'classes',o.classId);if(start<minute(o.time)+o.duration&&end>minute(o.time)&&(o.classId===l.classId||(o.teacher||oc.teacher)===(l.teacher||c.teacher)||(o.room||oc.room)===(l.room||c.room)))fail('班级、教师或教室在此时间段已有课程')}
 }
 function lesson(s,d,recordId){const old=recordId?find(s,'lessons',recordId):null;if(old?.checked)fail('请先撤销签到，再修改课时');if(old&&s.adjustments.some(x=>x.lessonId===old.id&&x.status==='已执行'))fail('该课程已执行调课，请通过新的调课记录调整');const c=find(s,'classes',d.classId);const x={...old,...d,id:recordId||id('lesson'),duration:number(d.duration,15,240),hours:number(d.hours||1,0.01,24),teacher:d.teacher||c.teacher,room:d.room||c.room,checked:false};conflict(s,x,x.id);return put(s,'lessons',x)}
 function change(s,d,recordId){const old=recordId?find(s,'changes',recordId):null;if(old?.delta)hours(s,old.studentId,-old.delta);if(old?.oldClassId){if(find(s,'students',old.studentId).classId!==old.classId)fail('学员已有后续转班，请先处理后续异动');transfer(s,old.studentId,old.oldClassId)}const x={...d,id:recordId||id('change'),hours:number(d.hours||0,0,10000),amount:number(d.amount||0),delta:0};const student=find(s,'students',x.studentId);
  if(!x.reason?.trim())fail('请填写原因');
  if(x.type==='请假'&&(!x.start||!x.end||x.start>x.end))fail('请假结束日期不能早于开始日期');
  if(x.type==='赠课'||x.type==='删除赠课'){if(x.hours<=0)fail('课时必须大于零');x.delta=x.type==='赠课'?x.hours:-x.hours;hours(s,x.studentId,x.delta)}
  if(x.type==='调课'){x.oldClassId=student.classId;transfer(s,x.studentId,x.classId)}
  if(x.type==='退费'){if(x.amount<=0)fail('退费金额必须大于零');x.delta=-x.hours;hours(s,x.studentId,x.delta)}
  return put(s,'changes',x);
 }
 function adjustment(s,d,recordId){const old=recordId?find(s,'adjustments',recordId):null;if(old?.status==='已执行')fail('已执行记录不可直接修改');const l=find(s,'lessons',d.lessonId);if(l.checked&&d.type!=='补课')fail('已签到课时只可申请补课');const x={...d,originText:old?.originText||`${l.date} ${l.time} ${find(s,'classes',l.classId).name}`,id:recordId||id('adjust'),status:old?.status==='已驳回'?'待审核':old?.status||'待审核',date:date(),deduct:number(d.deduct||0,0,24),compensate:number(d.compensate||0,0,24)};if(!x.reason?.trim())fail('请填写调整原因');if(x.scope==='部分学员'){x.studentIds=(d.studentIds||[]);if(!x.studentIds.length)fail('请至少选择一位学员');if(x.studentIds.some(i=>!members(s,l).some(y=>y.id===i)))fail('所选学员不在原课时名单中')}else x.studentIds=null;if(x.type!=='停课'&&(!x.targetDate||!x.targetTime))fail('请填写调整后的日期与时间');return put(s,'adjustments',x)}
 function executeAdjustment(s,recordId){const x=find(s,'adjustments',recordId);if(x.status!=='已通过')fail('只有审核通过的申请可以执行');const l=find(s,'lessons',x.lessonId);if(l.checked&&x.type!=='补课')fail('原课时已签到，不能执行此次调整');const targets=members(s,l).filter(y=>!x.studentIds||x.studentIds.includes(y.id));if(!targets.length)fail('没有可调整的学员');
  if(x.type==='停课'){if(x.studentIds)l.excludedStudentIds=[...new Set([...(l.excludedStudentIds||[]),...x.studentIds])];else l.cancelled=true}
  else{const c=find(s,'classes',l.classId);const dest={...l,date:x.targetDate,time:x.targetTime,teacher:x.type==='代课'?x.teacher:(l.teacher||c.teacher),room:x.room||l.room||c.room,checked:false,cancelled:false,adjustmentId:x.id};delete dest.excludedStudentIds;
   if(x.type==='补课'||x.studentIds){dest.id=id('makeup');dest.studentIds=targets.map(y=>y.id);conflict(s,dest);s.lessons.push(dest);if(x.type!=='补课')l.excludedStudentIds=[...new Set([...(l.excludedStudentIds||[]),...dest.studentIds])];x.createdLessonId=dest.id}
   else {conflict(s,dest,l.id);Object.assign(l,dest)}
  }
  for(const student of targets)hours(s,student.id,x.compensate-x.deduct);
  x.status='已执行';x.executedAt=date();
 }
 function teacherHours(s,name,month){return s.lessons.filter(l=>l.checked&&!l.cancelled&&(l.teacher||s.classes.find(c=>c.id===l.classId)?.teacher)===name&&l.date.startsWith(month))}
 function settlement(s,d,recordId){const old=recordId?find(s,'settlements',recordId):null;if(old&&['已确认','已发放'].includes(old.status))fail('请先作废已确认的结算单');if(!/^\d{4}-\d{2}$/.test(d.month))fail('月份格式应为 YYYY-MM');if(s.settlements.some(x=>x.id!==recordId&&x.teacher===d.teacher&&x.month===d.month&&x.status!=='已作废'))fail('该教师该月已有结算单');const rows=teacherHours(s,d.teacher,d.month),actual=round(rows.reduce((a,l)=>a+(l.hours||1),0)),price=number(d.price),adjust=number(d.adjust||0,-10000,10000),reward=number(d.reward||0),deduct=number(d.deduct||0),finalHours=round(actual+adjust),finalAmount=round(finalHours*price+reward-deduct);if(finalHours<0||finalAmount<0)fail('结算课时或金额不能为负');return put(s,'settlements',{...d,id:recordId||id('settle'),price,adjust,reward,deduct,actual,finalHours,finalAmount,lessonIds:rows.map(l=>l.id),details:rows.map(l=>({date:l.date,className:find(s,'classes',l.classId).name,hours:l.hours||1})),status:'待确认'})}
 function remove(s,k,recordId){const x=find(s,k,recordId);
  if(k==='enrollments'){if(x.legacy)fail('期初记录不可删除');if(x.applied)hours(s,x.studentId,-(x.hours+x.gift));if(x.oldClassId){if(find(s,'students',x.studentId).classId!==x.classId)fail('学员已有后续转班，请先处理后续异动');transfer(s,x.studentId,x.oldClassId)}}
  if(k==='changes'){if(x.delta)hours(s,x.studentId,-x.delta);if(x.oldClassId){if(find(s,'students',x.studentId).classId!==x.classId)fail('学员已有后续转班，请先处理后续异动');transfer(s,x.studentId,x.oldClassId)}}
  if(k==='lessons'){if(s.adjustments.some(a=>a.lessonId===x.id))fail('请先删除关联调课申请');if(x.checked)undoAttendance(s,x.id)}
  if(k==='courses'&&s.classes.some(c=>c.courseId===x.id))fail('课程已关联班级，请先调整关联');
  if(k==='classes'&&(s.students.some(v=>v.classId===x.id)||s.lessons.some(v=>v.classId===x.id)||s.enrollments.some(v=>v.classId===x.id)))fail('班级已有业务记录，建议停用');
  if(k==='adjustments'&&x.status==='已执行')fail('已执行的调课记录需保留追踪');
  if(k==='settlements'&&['已确认','已发放'].includes(x.status))fail('先作废结算单，再删除');
  if(k==='staff'&&(s.classes.some(c=>c.teacher===x.name)||s.lessons.some(l=>l.teacher===x.name)||s.settlements.some(l=>l.teacher===x.name)))fail('教师已有业务记录，建议停用');
  s[k]=s[k].filter(y=>y.id!==recordId);validate(s);
 }
 function audit(s,text){s.logs.push({id:id('log'),date:new Date().toLocaleString('zh-CN'),name:text,operator:'管理员',status:'成功'});s.logs=s.logs.slice(-500)}
 return {upgrade,validate,number,round,find,id,balance,hours,put,transfer,enrollment,attendance,undoAttendance,members,conflict,lesson,change,adjustment,executeAdjustment,teacherHours,settlement,remove,audit};
})();
