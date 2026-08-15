/* eslint-disable react/prop-types */
import { useState, useEffect, useCallback } from "react";
import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

const API_HEADERS = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'x-api-key': import.meta.env.VITE_API_KEY || '', // isi di .env (VITE_API_KEY), wajib sama dengan API_SECRET_KEY di Laravel
};

/* ═══════════════════════════════════════════════════════════════
   DESIGN TOKENS - RAW GYM BRANDING
═══════════════════════════════════════════════════════════════ */
const T = {
  bg:"#05050A",surface:"#0A0A15",card:"#111122",cardHi:"#18182E",
  border:"#1E1E30",borderHi:"#2E2E48",
  text:"#FFFFFF",muted:"#8E8EAF",dim:"#363658",
  lime:"#CCFF00",cyan:"#00E5FF",orange:"#FF5C00",
  green:"#00FF85",red:"#FF3131",yellow:"#FFD700",purple:"#B39DDB",blue:"#4FC3F7",
};
const F={display:"'Bebas Neue','Impact',sans-serif",body:"'DM Sans','Segoe UI',sans-serif",mono:"'JetBrains Mono',monospace"};
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/* ═══════════════════════════════════════════════════════════════
   MOCK DATA - BALI BRANCHES & ONLINE
═══════════════════════════════════════════════════════════════ */
const BRANCHES_INIT = [];

const TRAINERS_INIT=[
  {id:"T1",name:"Coach Hendra",avatar:"🏋️",specialty:"HIIT & Strength", rating:4.9,sessions:1240,branchId:"B1",certs:["ACE","NSCA"],    bio:"10+ years experience. HIIT and strength training specialist.",ig:"@coachhendra",
   phone:"+62 878-1111-2222",dob:"10 Jun 1988",address:"Jl. Labuansait No. 5, Uluwatu, Bali",docs:["ACE Certificate (2020)","NSCA-CPT (2022)"]},
  {id:"T2",name:"Sari Wijaya",  avatar:"🧘",specialty:"Yoga & Pilates",  rating:4.8,sessions:980, branchId:"B1",certs:["RYT-200","STOTT"], bio:"Certified yoga instructor with a mindful movement approach.",ig:"@sariyoga",
   phone:"+62 815-2222-3333",dob:"3 Feb 1991",address:"Jl. Petitenget No. 8, Seminyak, Bali",docs:["RYT-200 (Yoga Alliance 2019)","STOTT Pilates (2021)"]},
  {id:"T3",name:"Reza Kurnia",  avatar:"🥊",specialty:"Boxing & MMA",    rating:4.9,sessions:756, branchId:"B2",certs:["USA Boxing","ISKA"], bio:"Former professional boxer.",ig:"@rezaboxer",
   phone:"+62 819-3333-4444",dob:"18 Sep 1987",address:"Jl. Batu Mejan No. 3, Canggu, Bali",docs:["USA Boxing Coach Cert (2018)","ISKA Instructor (2020)"]},
  {id:"T4",name:"Luna Sari",    avatar:"⚡",specialty:"Pilates & Core",  rating:4.7,sessions:620, branchId:"B2",certs:["STOTT","ACE"],       bio:"Passionate about core strength and body alignment.",ig:"@lunafitness",
   phone:"+62 822-4444-5555",dob:"7 Nov 1993",address:"Jl. Pantai Berawa No. 11, Canggu, Bali",docs:["STOTT Pilates Essential (2020)","ACE Personal Trainer (2021)"]},
  {id:"T5",name:"Bima Pratama", avatar:"🚴",specialty:"Cycling & Cardio",rating:4.8,sessions:890, branchId:"B3",certs:["Spinning","ACE"],    bio:"International certified RPM instructor.",ig:"@bimacycle",
   phone:"+62 856-5555-6666",dob:"25 Mar 1990",address:"Jl. Raya Berawa No. 20, Tibubeneng, Bali",docs:["Mad Dogg Spinning Cert (2019)","ACE Group Fitness (2021)"]},
  {id:"T6",name:"Dewi Rahayu",  avatar:"💃",specialty:"Dance & Zumba",   rating:4.9,sessions:1100,branchId:"B3",certs:["Zumba","ACE"],       bio:"Zumba master instructor.",ig:"@dewizumba",
   phone:"+62 831-6666-7777",dob:"14 Jul 1989",address:"Jl. Pantai Berawa No. 6, Tibubeneng, Bali",docs:["Zumba B1 License (2017)","Zumba Master Instructor (2022)"]},
  {id:"T7",name:"Andi Setiawan",avatar:"💪",specialty:"Strength & Power",rating:4.8,sessions:945, branchId:"B4",certs:["CSCS","NSCA"],       bio:"Strength & conditioning specialist.",ig:"@andipowerlift",
   phone:"+62 858-7777-8888",dob:"2 Dec 1986",address:"Jl. Raya Sanggingan No. 15, Ubud, Bali",docs:["CSCS (NSCA 2016)","FMS Level 2 (2019)"]},
  {id:"T8",name:"Maya Lestari", avatar:"🌿",specialty:"Yoga & Wellness", rating:4.9,sessions:780, branchId:"B4",certs:["RYT-500","Yin"],     bio:"Holistic wellness practitioner.",ig:"@mayawellness",
   phone:"+62 813-8888-9999",dob:"30 Apr 1992",address:"Jl. Bisma No. 4, Ubud, Bali",docs:["RYT-500 (2021)","Yin Yoga Teacher (2022)","Nutrition Coach (2023)"]},
];

// Gym Settings initial data (editable by admin)
const GYM_SETTINGS_INIT = [];

const CLASSES_INIT=[
  {id:"C1", branchId:"B1",name:"HIIT INFERNO",   trainerId:"T1",time:"06:00",day:"Mon",duration:"45 min",slots:3, total:15,icon:"🔥",intensity:"HIGH",category:"HIIT",    color:"#FF3131",status:"active"},
  {id:"C2", branchId:"B1",name:"YOGA FLOW",       trainerId:"T2",time:"07:30",day:"Mon",duration:"60 min",slots:8, total:12,icon:"🧘",intensity:"LOW", category:"Yoga",    color:"#B39DDB",status:"active"},
  {id:"C3", branchId:"B1",name:"STRENGTH BEAST",  trainerId:"T1",time:"09:00",day:"Tue",duration:"60 min",slots:2, total:10,icon:"🏋️",intensity:"HIGH",category:"Strength",color:"#FF5C00",status:"active"},
  {id:"C4", branchId:"B2",name:"BOXING PRO",      trainerId:"T3",time:"07:00",day:"Mon",duration:"60 min",slots:5, total:10,icon:"🥊",intensity:"HIGH",category:"Boxing",  color:"#FF3131",status:"active"},
  {id:"C5", branchId:"B2",name:"PILATES SCULPT",  trainerId:"T4",time:"09:30",day:"Mon",duration:"55 min",slots:7, total:10,icon:"🧘",intensity:"MED", category:"Pilates", color:"#B39DDB",status:"active"},
  {id:"C6", branchId:"B3",name:"OUTDOOR RUN",     trainerId:"T5",time:"06:00",day:"Mon",duration:"60 min",slots:12,total:20,icon:"🏃",intensity:"MED", category:"Cardio",  color:"#00FF85",status:"active"},
  {id:"C7", branchId:"B4",name:"POWER LIFT",      trainerId:"T7",time:"06:30",day:"Mon",duration:"70 min",slots:4, total:8, icon:"🏋️",intensity:"HIGH",category:"Strength",color:"#FFD700",status:"active"},
  {id:"CO1", branchId:"ONLINE",name:"VIRTUAL HIIT", trainerId:"T1",time:"10:00",day:"Mon",duration:"45 min",slots:45, total:50,icon:"💻",intensity:"HIGH",category:"HIIT", color:T.blue,status:"active"},
  {id:"CO2", branchId:"ONLINE",name:"HOME YOGA",    trainerId:"T2",time:"19:00",day:"Tue",duration:"60 min",slots:20, total:50,icon:"🧘",intensity:"LOW", category:"Yoga", color:T.purple,status:"active"},
];

const USERS_INIT=[
  {id:"U1",role:"member", email:"alex@gym.com",  pass:"123",name:"Alex Fitria",  avatar:"💪",plan:"Monthly",  branchId:"B1",streak:7, joinDate:"Jan 2025",spend:450000, totalClasses:14,
   phone:"+62 812-3456-7890", dob:"15 Mar 1995", address:"Jl. Sunset Road No. 12, Seminyak, Bali", emergencyContact:"Fitria (+62 813-9999-0000)"},
  {id:"U2",role:"member", email:"rina@gym.com",  pass:"123",name:"Rina Dewi",    avatar:"🧘",plan:"Annual",   branchId:"B2",streak:14,joinDate:"Nov 2024",spend:3200000,totalClasses:47,
   phone:"+62 821-5678-9012", dob:"22 Aug 1992", address:"Jl. Batu Bolong No. 5, Canggu, Bali",    emergencyContact:"Dewi (+62 856-1234-5678)"},
  {id:"U3",role:"admin",  email:"admin@gym.com", pass:"123",name:"Super Admin",  avatar:"🛡️",plan:null,      branchId:null,streak:0,
   phone:"+62 811-0000-0001", dob:"01 Jan 1985", address:"HQ RAW Gym, Bali", emergencyContact:""},
  {id:"U4",role:"trainer",email:"coach@gym.com", pass:"123",name:"Coach Hendra", avatar:"🏋️",branchId:"B1",trainerId:"T1",
   phone:"+62 878-1111-2222", dob:"10 Jun 1988", address:"Jl. Labuansait No. 5, Uluwatu, Bali", emergencyContact:""},
];

const BOOKINGS_INIT=[
  {id:"BK001",userId:"U1",classId:"C1",branchId:"B1",className:"HIIT INFERNO",  trainer:"Coach Hendra",date:"Mon, 17 Mar",time:"06:00",status:"upcoming", paymentStatus:"verified", amount:75000, method:"GoPay"},
];

const TRANSFERS_INIT=[
  {id:"TR001",userId:"U1",type:"member",name:"Alex Fitria",fromBranchId:"B1",toBranchId:"B4",reason:"Closer to my new villa",status:"pending",date:"14 Mar 2025"},
];

const PRODUCTS_INIT = [
  // Merchandise
  { id: "P1", name: "Oversized RAW Tee", price: 250000, cost: 120000, stock: 15, icon: "👕", category: "Merchandise", description: "Premium cotton oversized tee with RAW branding. Available S-XXL.", img: "👕" },
  { id: "P2", name: "RAW Gym Bag", price: 450000, cost: 220000, stock: 8, icon: "🎒", category: "Merchandise", description: "Durable gym bag with separate wet pocket and shoe compartment.", img: "🎒" },
  { id: "P3", name: "RAW Cap", price: 150000, cost: 60000, stock: 20, icon: "🧢", category: "Merchandise", description: "Structured snapback cap. One size fits all.", img: "🧢" },
  // Supplements
  { id: "P4", name: "RAW Whey Isolate", price: 850000, cost: 600000, stock: 24, icon: "🥤", category: "Supplements", description: "25g protein per serving. Chocolate & Vanilla flavour. 1kg pack.", img: "🥤" },
  { id: "P5", name: "Pre-Workout Monster", price: 450000, cost: 310000, stock: 8, icon: "⚡", category: "Supplements", description: "High-stim pre-workout. 30 servings. Sour Watermelon flavour.", img: "⚡" },
  { id: "P6", name: "BCAA Recovery", price: 320000, cost: 200000, stock: 12, icon: "💊", category: "Supplements", description: "Essential amino acids for faster recovery. 60 servings.", img: "💊" },
  // Equipment
  { id: "P7", name: "RAW Lifting Belt", price: 650000, cost: 400000, stock: 0, icon: "🏋️", category: "Equipment", description: "Genuine leather powerlifting belt. 10mm thickness. S/M/L/XL.", img: "🏋️" },
  { id: "P8", name: "Resistance Bands Set", price: 280000, cost: 130000, stock: 14, icon: "🔴", category: "Equipment", description: "5-band set from light to extra heavy. Latex-free.", img: "🔴" },
  { id: "P9", name: "Jump Rope Pro", price: 180000, cost: 80000, stock: 22, icon: "🪢", category: "Equipment", description: "Speed rope with ball-bearing handles for double-unders.", img: "🪢" },
  // Events
  { id: "P10", name: "RAW Throwdown 2025", price: 350000, cost: 50000, stock: 50, icon: "🏆", category: "Events", description: "Annual fitness competition. All levels welcome. May 24–25, 2025. Includes T-shirt & medal.", img: "🏆" },
  { id: "P11", name: "Nutrition Workshop", price: 200000, cost: 30000, stock: 20, icon: "🥗", category: "Events", description: "3-hour workshop on sports nutrition with certified dietitian. Apr 12, 2025.", img: "🥗" },
  // F&B
  { id: "P12", name: "Protein Smoothie", price: 55000, cost: 20000, stock: 99, icon: "🥛", category: "F&B", description: "Fresh blended protein smoothie. 5 flavours. Pick up at café.", img: "🥛" },
  { id: "P13", name: "Açaí Bowl", price: 65000, cost: 28000, stock: 99, icon: "🍇", category: "F&B", description: "Açaí with granola, banana, honey & almond butter. Café only.", img: "🍇" },
  { id: "P14", name: "Cold Brew Coffee", price: 40000, cost: 12000, stock: 99, icon: "☕", category: "F&B", description: "18-hour cold brew, black or with oat milk.", img: "☕" },
];

const PLANS=[];

const getNext30Days = () => {
  const days = [];
  const map = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const today = new Date();
  for(let i=0; i<30; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push({
      dayName: map[d.getDay()], 
      dateNum: d.getDate(),
      fullDate: `${map[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]}`
    });
  }
  return days;
};
const DYNAMIC_DAYS = getNext30Days();

const REV={
  B1:[{m:"Oct",v:5.2},{m:"Nov",v:6.8},{m:"Dec",v:8.1},{m:"Jan",v:7.2},{m:"Feb",v:9.4},{m:"Mar",v:10.2}],
  B2:[{m:"Oct",v:3.8},{m:"Nov",v:4.2},{m:"Dec",v:5.1},{m:"Jan",v:4.6},{m:"Feb",v:5.8},{m:"Mar",v:6.4}],
  B3:[{m:"Oct",v:2.1},{m:"Nov",v:2.6},{m:"Dec",v:3.2},{m:"Jan",v:2.9},{m:"Feb",v:3.4},{m:"Mar",v:3.9}],
  B4:[{m:"Oct",v:4.1},{m:"Nov",v:4.8},{m:"Dec",v:6.2},{m:"Jan",v:5.6},{m:"Feb",v:6.8},{m:"Mar",v:7.4}],
};

// Initial Trainer Logs
const t1_start = new Date(); t1_start.setHours(t1_start.getHours() - 6);
const LOGS_INIT = {
  "T1": { status: "active", lastAction: t1_start, history: [{type: "START", time: t1_start}] },
  "T2": { status: "inactive", history: [{type: "START", time: new Date(Date.now() - 28800000)}, {type: "END", time: new Date(Date.now() - 3600000)}] },
};

/* ═══════════════════════════════════════════════════════════════
   PURE UTILITY HELPERS
═══════════════════════════════════════════════════════════════ */

// Derive plan duration in days
function getPlanDays(plan){
  if(!plan) return 30;
  const p = plan.toLowerCase();
  if(p.includes("annual") || p.includes("yearly")) return 365;
  if(p.includes("quarterly") || p.includes("3 month")) return 90;
  if(p.includes("monthly") || p.includes("month")) return 30;
  return 1; // per visit
}

// Menghitung tanggal tagihan berikutnya (Recurrent Billing) presisi dengan Tanggal
function getNextBillingDate(user) {
  if(!user?.joinDate || !user?.plan || user.plan === "Per Visit") return null;
  const planMap = {"Jan":0,"Feb":1,"Mar":2,"Apr":3,"May":4,"Jun":5,"Jul":6,"Aug":7,"Sep":8,"Oct":9,"Nov":10,"Dec":11};
  const parts = user.joinDate.trim().split(" ");
  
  let day = 1, startMonth = 0, startYear = new Date().getFullYear();
  if (parts.length === 3) { // Format: "25 Mar 2024"
    day = parseInt(parts[0]); startMonth = planMap[parts[1]] ?? 0; startYear = parseInt(parts[2]);
  } else if (parts.length === 2) { // Format lama: "Mar 2024"
    startMonth = planMap[parts[0]] ?? 0; startYear = parseInt(parts[1]);
  } else return null;

  let billingDate = new Date(startYear, startMonth, day);
  const now = new Date();
  now.setHours(0,0,0,0);

  // Majukan tanggal tagihan secara berulang sampai menemukan tanggal masa depan
  while(billingDate < now) {
    const p = user.plan.toLowerCase();
    if(p.includes("annual") || p.includes("yearly")) billingDate.setFullYear(billingDate.getFullYear() + 1);
    else if(p.includes("quarterly") || p.includes("3 month")) billingDate.setMonth(billingDate.getMonth() + 3);
    else billingDate.setMonth(billingDate.getMonth() + 1); // Default: Monthly
  }
  return billingDate;
}

// Menghitung kapan pembayaran terakhir dilakukan
function getLastPaymentDate(user) {
  const next = getNextBillingDate(user);
  if(!next) return null;
  const last = new Date(next);
  const p = user.plan.toLowerCase();
  if(p.includes("annual") || p.includes("yearly")) last.setFullYear(last.getFullYear() - 1);
  else if(p.includes("quarterly") || p.includes("3 month")) last.setMonth(last.getMonth() - 3);
  else last.setMonth(last.getMonth() - 1);
  return last;
}

// Calculate days remaining until next billing
function getDaysLeft(user){
  if(!user?.plan || user.plan === "Per Visit") return "–";
  const nextBilling = getNextBillingDate(user);
  if(!nextBilling) return "–";
  const now = new Date();
  now.setHours(0,0,0,0);
  const diff = Math.ceil((nextBilling - now) / 86400000);
  return diff >= 0 ? diff : 0;
}

// Calculate total calories burned (approx 8 kcal/min per class avg 50 min)
function getCalories(totalClasses){
  const approx = (totalClasses || 0) * 50 * 8;
  if(approx >= 1000) return (approx/1000).toFixed(1)+"K";
  return approx.toString();
}

// Months active since joinDate
function getMonthsActive(joinDate){
  if(!joinDate) return 0;
  const planMap = {"Jan":0,"Feb":1,"Mar":2,"Apr":3,"May":4,"Jun":5,"Jul":6,"Aug":7,"Sep":8,"Oct":9,"Nov":10,"Dec":11};
  const parts = joinDate.trim().split(" ");
  const month = planMap[parts[0]] ?? 0;
  const year  = parseInt(parts[1]) || 2025;
  const start = new Date(year, month, 1);
  const now   = new Date();
  return Math.max(1, (now.getFullYear() - start.getFullYear())*12 + (now.getMonth() - start.getMonth()) + 1);
}

// Simple points system: 10 pts per class + 50 pts per month active
function getPoints(user){
  const pts = (user?.totalClasses||0)*10 + getMonthsActive(user?.joinDate)*50;
  return pts >= 1000 ? (pts/1000).toFixed(1)+"K" : pts.toString();
}

// Today's day abbreviation matching DAYS array
function getTodayDay(){
  const map = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  return map[new Date().getDay()];
}

/* ─── PRIVATE BOOKING MODAL (Member) ───────────────────────── */
function PrivateBookingModal({trainers, branches, classes, bookings, onClose, onProceed, accent}) {
  const [f, setF] = useState({ trainerId: trainers[0]?.id||"", date: DYNAMIC_DAYS[0], time: "09:00", locType: "branch", branchId: branches[0]?.id||"", customLoc: "" });
  const [err, setErr] = useState("");
  const s = (k,v) => setF(p => ({...p, [k]: v}));

  // Generate opsi waktu dari 06:00 - 20:00
  const timeOptions = Array.from({length: 15}, (_, i) => `${(i+6).toString().padStart(2,'0')}:00`);

  const handleCheckAndProceed = () => {
    setErr("");
    const tr = trainers.find(t => t.id === f.trainerId);
    if(!tr) return setErr("Please select a trainer");

    // 1. Cek Bentrok dengan Kelas Reguler Trainer
    const clashReg = classes.find(c => c.trainerId === f.trainerId && c.day === f.date.dayName && c.time === f.time && c.status === "active");
    if(clashReg) return setErr(`${tr.name} is teaching a regular class (${clashReg.name}) at this time.`);

    // 2. Cek Bentrok dengan Private Class orang lain (yg sudah verified atau pending)
    const clashPriv = bookings.find(b => b.type === "private" && b.trainer === tr.name && b.date === f.date.fullDate && b.time === f.time && b.paymentStatus !== "failed");
    if(clashPriv) return setErr(`${tr.name} is already booked for a private session at this time.`);

    if(f.locType === "custom" && !f.customLoc.trim()) return setErr("Please input your custom location.");

    const locText = f.locType === "branch" ? branches.find(b=>b.id===f.branchId)?.name : f.customLoc;
    
    // Harga private session flat Rp 500.000 (Bisa disesuaikan nanti)
    onProceed({
      trainerName: tr.name, date: f.date.fullDate, time: f.time, price: 500000,
      branchId: f.locType === "branch" ? f.branchId : "CUSTOM",
      locationText: locText
    });
  };

  return (
    <Modal onClose={onClose}>
      <div style={{padding:"26px 24px 40px"}}>
        <div style={{fontFamily:F.display,fontSize:24,color:T.text,letterSpacing:2,marginBottom:18}}>BOOK PRIVATE SESSION</div>
        
        <div style={{marginBottom:12}}>
          <div style={{fontSize:11,color:T.muted,fontFamily:F.mono,letterSpacing:2,marginBottom:6}}>SELECT COACH</div>
          <select value={f.trainerId} onChange={e=>s("trainerId",e.target.value)} style={{width:"100%",background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"11px 14px",color:T.text,fontSize:13,colorScheme:"dark",outline:"none"}}>
            {trainers.map(t=><option key={t.id} value={t.id}>{t.name} ({t.specialty})</option>)}
          </select>
        </div>

        <div style={{fontSize:11,color:T.muted,fontFamily:F.mono,letterSpacing:2,marginBottom:6}}>SELECT DATE</div>
        <DaySel selDate={f.date} setSelDate={(d)=>s("date", d)} accent={accent} />

        <div style={{marginBottom:12, marginTop:12}}>
          <div style={{fontSize:11,color:T.muted,fontFamily:F.mono,letterSpacing:2,marginBottom:6}}>SELECT TIME</div>
          <select value={f.time} onChange={e=>s("time",e.target.value)} style={{width:"100%",background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"11px 14px",color:T.text,fontSize:13,colorScheme:"dark",outline:"none"}}>
            {timeOptions.map(t=><option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div style={{display:"flex", background:T.card, borderRadius:12, padding:4, marginBottom:12, border:`1px solid ${T.border}`}}>
          <div onClick={()=>s("locType","branch")} style={{flex:1, textAlign:"center", padding:"8px", borderRadius:8, background:f.locType==="branch"?accent:"transparent", color:f.locType==="branch"?T.bg:T.muted, fontWeight:700, fontSize:12, cursor:"pointer", transition:"all .2s"}}>GYM BRANCH</div>
          <div onClick={()=>s("locType","custom")} style={{flex:1, textAlign:"center", padding:"8px", borderRadius:8, background:f.locType==="custom"?T.purple:"transparent", color:f.locType==="custom"?T.bg:T.muted, fontWeight:700, fontSize:12, cursor:"pointer", transition:"all .2s"}}>CUSTOM LOCATION</div>
        </div>

        {f.locType === "branch" ? (
          <select value={f.branchId} onChange={e=>s("branchId",e.target.value)} style={{width:"100%",background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"11px 14px",color:T.text,fontSize:13,colorScheme:"dark",outline:"none",marginBottom:16}}>
            {branches.map(b=><option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        ) : (
          <textarea value={f.customLoc} onChange={e=>s("customLoc",e.target.value)} placeholder="e.g. My Villa, Canggu..." rows={2} style={{width:"100%",background:T.card,border:`1px solid ${T.purple}`,borderRadius:12,padding:"11px 14px",color:T.text,fontSize:13,resize:"none",marginBottom:16,outline:"none"}}/>
        )}

        {err && <div style={{background:"#FF313118",border:"1px solid #FF313144",borderRadius:10,padding:"9px 14px",marginBottom:12,fontSize:13,color:T.red,fontWeight:600}}>⚠️ {err}</div>}

        <button onClick={handleCheckAndProceed} style={{width:"100%",padding:14,borderRadius:12,fontFamily:F.display,fontSize:17,letterSpacing:2,background:accent,color:T.bg,fontWeight:700}}>PROCEED TO PAYMENT (500K)</button>
      </div>
    </Modal>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ROOT APP (STATE MANAGER)
═══════════════════════════════════════════════════════════════ */
export default function App(){
  const [user,setUser]=useState(null);
  const [mode,setMode]=useState("explore"); 
  const [trainers,setTrainers]=useState(TRAINERS_INIT);
  const [branches, setBranches] = useState(BRANCHES_INIT);
  const [classes,setClasses]=useState(CLASSES_INIT);
  const [users,setUsers]=useState(USERS_INIT);
  const [bookings,setBookings]=useState(BOOKINGS_INIT);
  const [transfers,setTransfers]=useState(TRANSFERS_INIT);
  const [products,setProducts]=useState(PRODUCTS_INIT);
  const [sales,setSales]=useState([]);
  const [plans, setPlans] = useState([
  { id: 'visit', name: 'Per Visit', price: 75000, period: '/visit', badge: '', icon: '🎯', color: '#00E5FF' },
  { id: 'monthly', name: 'Monthly', price: 350000, period: '/month', badge: 'POPULAR', icon: '📅', color: '#CCFF00' },
  { id: 'quarterly', name: 'Quarterly', price: 900000, period: '/3 months', badge: 'SAVE 14%', icon: '📊', color: '#B39DDB' },
  { id: 'annually', name: 'Annual', price: 3000000, period: '/year', badge: 'SAVE 29%', icon: '👑', color: '#FFD700' }
]);
  const [gymSettings, setGymSettings] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [clientNotes, setClientNotes] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [trainerLogs,setTrainerLogs]=useState(LOGS_INIT);
  const [broadcasts,setBroadcasts]=useState([{id:1, text:"Welcome to RAW Gym! Stay hydrated and crush your goals.", date:"Today"}]);
  const [fitnessProgress,setFitnessProgress]=useState({"U1": [{id:1, date:"10 Mar", weight:75, note:"Start recording"}]});
  const [securityLog,setSecurityLog]=useState([
    {id:1, event:"Login successful", device:"iPhone 15 Pro · Safari", ip:"103.12.45.67", time: new Date(Date.now()-3600000)},
    {id:2, event:"Password changed",  device:"MacBook Pro · Chrome",   ip:"103.12.45.67", time: new Date(Date.now()-86400000*3)},
    {id:3, event:"Login successful", device:"MacBook Pro · Chrome",    ip:"103.12.45.67", time: new Date(Date.now()-86400000*3)},
  ]);
  const [supportTickets,setSupportTickets]=useState([
    {id:"ST001",userId:"U1",userName:"Alex Fitria",subject:"Locker issue at Uluwatu",message:"My locker was jammed and I couldn't access it after class.",status:"open",date:new Date(Date.now()-86400000*2),replies:[{from:"admin",text:"Hi Alex, we're sorry to hear that. Our staff will check locker #42 today.",time:new Date(Date.now()-86400000)}]},
  ]);
  const [badges, setBadges] = useState([]);

 // 🟢 TRIGGER NOTIFIKASI PENDING PAYMENT (LIST TRANSAKSI KHUSUS ADMIN)
  useEffect(() => {
    if (!user) return;

    // 🛡️ PENGAMANAN: Jika yang login BUKAN Admin, sapu bersih semua notif berbau Admin yang nyangkut!
    if (user.role !== "admin") {
      setNotifications(prev => prev.filter(n => !String(n.id).startsWith("ADMIN_")));
      return;
    }

    const pendingList = bookings.filter(b => b.paymentStatus === "pending_verification");
    
    setNotifications(prev => {
      let updated = false;
      let currentNotifs = [...prev];

      // 1. Hapus notif lokal jika transaksinya sudah diverifikasi (sudah tidak pending)
      const pendingIds = pendingList.map(b => "ADMIN_PENDING_" + b.id);
      currentNotifs = currentNotifs.filter(n => {
        if (String(n.id).startsWith("ADMIN_PENDING_")) {
          if (!pendingIds.includes(n.id)) {
            updated = true;
            return false; 
          }
        }
        return true;
      });

      // 2. Tambahkan notif baru ke dalam list untuk transaksi yang masih pending
      pendingList.forEach(b => {
        const notifId = "ADMIN_PENDING_" + b.id;
        if (!currentNotifs.find(n => n.id === notifId)) {
          updated = true;
          currentNotifs.unshift({
            id: notifId,
            type: 'purchase',
            title: 'Pending Payment 💳',
            message: `ID: ${b.id} (${b.className}) awaits verification.`,
            is_read: false
          });
        }
      });

      return updated ? currentNotifs : prev;
    });
  }, [user, bookings]);

  // 🟢 SINKRONISASI BROADCAST KE NOTIFIKASI LOKAL (PENTING UNTUK WEB/LOCALHOST)
  useEffect(() => {
    if (user && broadcasts.length > 0) {
      setNotifications(prev => {
        let updated = false;
        let currentNotifs = [...prev];

        // Ambil 5 broadcast terbaru agar tidak memenuhi layar
        const recentBroadcasts = broadcasts.slice(0, 5);

        recentBroadcasts.forEach(b => {
          const notifId = "BROADCAST_" + b.id; // Beri label khusus
          
          // Jika broadcast ini belum ada di list notifikasi lonceng, masukkan!
          if (!currentNotifs.find(n => n.id === notifId)) {
            updated = true;
            currentNotifs.unshift({
              id: notifId,
              type: 'broadcast',
              title: '📢 Announcement',
              message: b.text,
              is_read: false // 👈 Akan memicu titik merah di lonceng
            });
          }
        });

        return updated ? currentNotifs : prev;
      });
    }
  }, [user, broadcasts]);

  // 🟢 SINKRONISASI NOTIFIKASI PAYMENT APPROVED UNTUK MEMBER (LOCAL/WEB BACKUP)
  useEffect(() => {
    if (user && user.role === "member") {
      // 👈 PERBAIKAN: Perluas filter untuk mencakup transaksi produk toko, bukan cuma kelas 'upcoming'
      const myApproved = bookings.filter(b => 
        b.userId === user.id && 
        b.paymentStatus === "verified" && 
        (b.status === "upcoming" || b.type === "product" || b.type === "purchase")
      );

      if (myApproved.length > 0) {
        setNotifications(prev => {
          let updated = false;
          let currentNotifs = [...prev];
          
          // Cek riwayat klik di memori browser
          const readApprovals = JSON.parse(localStorage.getItem('read_approvals') || '[]');

          myApproved.forEach(b => {
            const notifId = "APPROVED_" + b.id;
            
            // Jika belum masuk ke lonceng, masukkan sekarang!
            if (!currentNotifs.find(n => n.id === notifId)) {
              updated = true;
              currentNotifs.unshift({
                id: notifId,
                type: 'purchase',
                title: 'Payment Approved! ✅',
                message: `Pembayaran ${b.type === 'product' ? 'produk' : 'tiket'} ${b.className} telah diverifikasi.`,
                is_read: readApprovals.includes(b.id) // 👈 Otomatis jadi unread jika belum pernah diklik
              });
            }
          });

          return updated ? currentNotifs : prev;
        });
      }
    }
  }, [user, bookings]);

 // 🟢 1. NOTIFICATIONS FETCHING (REVISI FINAL - TANPA MEMBEBANI SERVER)
  useEffect(() => {
    if (!user) return;
    
    // Kita matikan fetch interval ke Laravel agar tidak ada lagi Error 500.
    // Notifikasi akan ditangani murni lewat Local State dan Push Notification FCM.
    setNotifications(prev => {
      const localNotifs = prev.filter(n => 
        String(n.id).startsWith("ADMIN_") || 
        String(n.id).startsWith("BILL_") || 
        String(n.id).startsWith("PUSH_") ||
        String(n.id).startsWith("BROADCAST_") ||
        String(n.id).startsWith("APPROVED_")
      );
      return [...localNotifs];
    });

  }, [user]); // Bersih tanpa setInterval

  // 🟢 2. INITIALIZE PUSH NOTIFICATIONS (FCM)
  useEffect(() => {
    if (!Capacitor.isNative || !user) return;

    const registerPush = async () => {
      let permStatus = await PushNotifications.checkPermissions();
      if (permStatus.receive === 'prompt') {
        permStatus = await PushNotifications.requestPermissions();
      }

      if (permStatus.receive !== 'granted') {
        console.log('❌ User menolak izin Push Notification');
        return;
      }

      await PushNotifications.register();

      PushNotifications.addListener('registration', async (token) => {
        console.log('📱 Device FCM Token:', token.value);
        
        try {
          await fetch(API_URL + '/user/update-fcm', {
            method: 'POST',
            headers: API_HEADERS,
            body: JSON.stringify({
              // 🛡️ PENGAMANAN: Pastikan user.id diubah ke string sebelum di-replace
              user_id: String(user.id).replace("U", ""), 
              fcm_token: token.value
            })
          });
          console.log('✅ Token sukses terkirim ke Laravel');
        } catch (error) {
          console.error('❌ Gagal sinkronisasi Token ke server', error);
        }
      });

      PushNotifications.addListener('registrationError', (error) => {
        console.error('Error pendaftaran push:', JSON.stringify(error));
      });

      PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('🔔 Push received: ', notification);
        
        setNotifications(prev => [{
          id: "PUSH_" + Date.now(),
          type: notification.data?.type || "broadcast",
          title: notification.title,
          message: notification.body,
          is_read: false
        }, ...prev]);
      });

      PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
        const data = notification.notification.data;
        if (data && data.type === 'class_reminder') {
           setMode("member");
        }
      });
    };

    registerPush();

    return () => {
      PushNotifications.removeAllListeners();
    };
  }, [user]);

// 🟢 SINKRONISASI BROADCAST KE NOTIFIKASI LOKAL (DENGAN STATUS UNREAD)
  useEffect(() => {
    if (user && broadcasts.length > 0) {
      setNotifications(prev => {
        let updated = false;
        let currentNotifs = [...prev];
        
        // Cek mana saja ID broadcast yang sudah pernah diklik/dibaca dari memori HP
        const readBcasts = JSON.parse(localStorage.getItem('read_bcasts') || '[]');

        broadcasts.slice(0, 5).forEach(b => {
          const notifId = "BROADCAST_" + b.id;
          
          if (!currentNotifs.find(n => n.id === notifId)) {
            updated = true;
            currentNotifs.unshift({
              id: notifId,
              type: 'broadcast',
              title: '📢 Announcement',
              message: b.text,
              is_read: readBcasts.includes(b.id) // 👈 Mengatur status unread secara otomatis
            });
          }
        });

        return updated ? currentNotifs : prev;
      });
    }
  }, [user, broadcasts]);

// 🟢 1. FUNGSI RENDER DATA (Bisa dipanggil oleh Server atau Local Cache)
  const applyDataToState = (data) => {
    if (!data || !data.users) return;
    
    const dbUsers = data.users.map(u => {
      let parsedCerts = []; let parsedDocs = [];
      try { parsedCerts = typeof u.certs === 'string' ? JSON.parse(u.certs) : (u.certs || []); } catch(e){}
      try { parsedDocs = typeof u.docs === 'string' ? JSON.parse(u.docs) : (u.docs || []); } catch(e){}
      return {
        id: "U" + u.id, role: u.role, email: u.email, pass: "123", name: u.name,
        avatar: u.avatar || "👤", plan: u.plan || "Per Visit", branchId: u.branch_id,
        trainerId: u.trainer_id, streak: u.streak || 0, joinDate: u.join_date || "Jan 2025",
        spend: u.spend || 0, totalClasses: u.total_classes || 0, phone: u.phone || "",
        dob: u.dob || "", address: u.address || "", emergencyContact: u.emergency_contact || "",
        bio: u.bio || "", ig: u.ig || "", specialty: u.specialty || "Mixed Martial Arts",
        certs: parsedCerts, docs: parsedDocs
      };
    });

    const dbTrainers = dbUsers.filter(u => u.role === "trainer").map(t => ({
      id: t.trainerId, name: t.name, email: t.email, avatar: t.avatar,
      rating: 4.9, sessions: 0, branchId: t.branchId, phone: t.phone, dob: t.dob,
      address: t.address, emergencyContact: t.emergencyContact, specialty: t.specialty,
      bio: t.bio, ig: t.ig, certs: t.certs, docs: t.docs
    }));

    const dbClasses = data.classes.map(c => ({
      id: c.id, branchId: c.branch_id, name: c.name, trainerId: c.trainer_id,
      time: c.time, day: c.day, duration: c.duration, slots: c.slots, total: c.total, 
      icon: c.icon, intensity: c.intensity, category: c.category, color: c.color, 
      status: c.status, videoUrl: c.video_url
    }));

    if (data.badges) setBadges(data.badges.map(b => ({id: b.id, icon: b.icon, name: b.name, desc: b.desc, ruleType: b.rule_type, targetValue: b.target_value})));
    if (data.reviews) setReviews(data.reviews);
    if (data.client_notes) setClientNotes(data.client_notes);

    const checkAutoRatings = (allBookings, currentReviews) => {
      const now = new Date();
      allBookings.forEach(b => {
        const classDate = new Date(b.date);
        const diffDays = (now - classDate) / (1000 * 60 * 60 * 24);
        if (diffDays > 3 && !currentReviews.find(r => r.booking_id === b.id) && b.paymentStatus === 'verified') {
           setReviews(prev => [...prev, { booking_id: b.id, trainer_id: b.trainerId, rating: 5, is_auto: true }]);
        }
      });
    };

    setUsers(dbUsers);
    setTrainers(prev => [...prev.filter(p => !dbTrainers.find(dt => dt.id === p.id)), ...dbTrainers]); 
    setClasses(dbClasses);
    setProducts(data.products);

    if (data.plans) setPlans(data.plans); // 👈 Sedot Plans dari DB

    if (data.branches) {
      const dbBranches = data.branches.map(b => {
        let parsedFacilities = []; let parsedTags = [];
        try { parsedFacilities = typeof b.facilities === 'string' ? JSON.parse(b.facilities) : (b.facilities || []); } catch(e){}
        try { parsedTags = typeof b.tags === 'string' ? JSON.parse(b.tags) : (b.tags || []); } catch(e){}
        return { ...b, facilities: Array.isArray(parsedFacilities) ? parsedFacilities : [], tags: Array.isArray(parsedTags) ? parsedTags : [], rating: parseFloat(b.rating) || 5.0, reviews: parseInt(b.reviews) || 0, members: parseInt(b.members) || 0 };
      });
      setBranches(dbBranches);

      // 🟢 BUAT GYM SETTINGS OTOMATIS DARI TABEL BRANCHES MYSQL
      const settingsObj = {};
      dbBranches.forEach(b => {
        settingsObj[b.id] = {
          hours: b.hours || "06:00-22:00",
          maxCapacity: b.max_capacity || 150,
          emergencyPhone: b.emergency_phone || "",
          wifi: b.wifi_network || "",
          lockerCount: b.locker_count || 50,
          parkingSlots: b.parking_slots || 30,
        };
      });
      setGymSettings(settingsObj);
    }

    if (data.transfers) {
      setTransfers(data.transfers.map(t => ({id: t.id, userId: t.user_id, type: t.type, name: t.name, fromBranchId: t.from_branch_id, toBranchId: t.to_branch_id, reason: t.reason, status: t.status, date: t.date})));
    }

    if (data.bookings) {
      setBookings(data.bookings.map(b => ({
        id: b.transaction_id, userId: "U" + String(b.user_id).replace(/[^0-9]/g, ""), classId: b.class_id,
        branchId: b.branch_id, className: b.class_name, trainer: b.trainer, date: b.date, time: b.time, 
        status: b.status, paymentStatus: b.payment_status, amount: b.amount, method: b.method, type: b.type, 
        icon: b.icon, category: b.category, description: b.description, isAttended: !!b.is_attended
      })));
    }

    if(data.tickets) setSupportTickets(data.tickets.map(t => ({...t, userId: t.user_id, userName: t.user_name, replies: t.replies || []})));
    if(data.broadcasts) setBroadcasts(data.broadcasts.sort((a,b) => b.id - a.id)); 

    if(data.progress) {
      const progObj = {};
      data.progress.forEach(p => {
        if(!progObj[p.user_id]) progObj[p.user_id] = [];
        progObj[p.user_id].unshift({ id: p.id, date: p.date, weight: p.weight, note: p.note });
      });
      setFitnessProgress(progObj);
    }

    if (data.trainer_shifts) {
      const formattedLogs = {};
      data.trainer_shifts.forEach(s => {
        const rawId = String(s.trainer_id).toUpperCase();
        const tid = rawId.startsWith("T") ? rawId : "T" + rawId; 
        if (!formattedLogs[tid]) formattedLogs[tid] = { status: "inactive", history: [] };
        
        let safeTimeStr = String(s.time).replace(/\.\d+/, "").trim();
        if (safeTimeStr.includes(" ")) safeTimeStr = safeTimeStr.replace(" ", "T");
        safeTimeStr = safeTimeStr.replace("Z", ""); 
        formattedLogs[tid].history.push({ type: s.type, time: safeTimeStr });
      });
      Object.keys(formattedLogs).forEach(tid => {
        const history = formattedLogs[tid].history.sort((a,b) => new Date(a.time).getTime() - new Date(b.time).getTime());
        if(history.length > 0) {
            const lastEntry = history[history.length - 1];
            formattedLogs[tid].status = lastEntry.type === "START" ? "active" : "inactive";
            formattedLogs[tid].lastAction = new Date(lastEntry.time);
        }
        formattedLogs[tid].history = history;
      });
      setTrainerLogs(formattedLogs);
    }
  };

  // 🟢 2. MENGAMBIL DATA AWAL (DENGAN STRATEGI OFFLINE CACHE)
  useEffect(() => {
    const fetchInitData = async () => {
      try {
        const res = await fetch(API_URL + '/init-data', { headers: API_HEADERS });
        if (!res.ok) throw new Error("Gagal mengambil data dari server");
        const data = await res.json();
        
        // Simpan ke brankas HP
        localStorage.setItem("rawgym_offline_cache", JSON.stringify(data));
        applyDataToState(data);
      } catch (err) {
        console.warn("Offline/Server lambat. Beralih ke Cache Lokal...");
        const cachedStr = localStorage.getItem("rawgym_offline_cache");
        if (cachedStr) {
          try {
            applyDataToState(JSON.parse(cachedStr));
            setNotifications(prev => [{
              id: "OFFLINE_MODE", type: "broadcast", title: "Offline Mode 📡",
              message: "Showing saved data. Actions will sync when online.", is_read: false
            }, ...prev]);
          } catch (e) {}
        }
      }
    };
    fetchInitData();
  }, []);

  function handleLogin(u) {
        const fullUser = users.find(x => x.id === u.id);
        setUser(fullUser || u);
        setMode(u.role);
    }

  const handleRegister = async (newUser) => {
    try {
      const response = await fetch(API_URL + '/register', {
        method: 'POST',
        headers: API_HEADERS,
        body: JSON.stringify({
          name: newUser.name,
          email: newUser.email,
          password: newUser.pass,
          branch_id: newUser.branchId
        })
      });

      // Proteksi jika server Laravel error 500 (crash)
      if (!response.ok) {
        let errMsg = "Terjadi kesalahan di server Laravel (500).";
        try { const errData = await response.json(); errMsg = errData.message || errMsg; } catch {}
        alert("Gagal mendaftar: " + errMsg);
        return;
      }

      const data = await response.json();

      if (data.status === 'success') {
        const registeredUser = { ...newUser, id: "U" + data.user.id }; 
        setUsers(prev => [registeredUser, ...prev]);
        handleLogin(registeredUser);
      }
    } catch (error) {
      console.error("API Error:", error);
      alert("Tidak dapat terhubung ke server database.");
    }
  };

  const handleLogout = () => {
    setUser(null);
    setMode("explore");
    setNotifications([]);
  };
  
  const updateTrainerStatus = (id, newStatus) => {
    setTrainers(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  const getTrainerStats = (trainerId) => {
    // Pastikan memfilter berdasarkan ID trainer (misal: "T1", "T2")
    const trReviews = reviews.filter(r => r.trainer_id === trainerId);
    if (trReviews.length === 0) return { avg: "4.0", count: 0 }; // 👈 Default 4.0 jika kosong
    const sum = trReviews.reduce((s, r) => s + parseInt(r.rating), 0);
    return { 
      avg: (sum / trReviews.length).toFixed(1), 
      count: trReviews.length 
    };
  };

// 🟢 3. TRANSAKSI TOKO (DENGAN OFFLINE QUEUE)
  const processPurchase = async (product, userId, paymentStatus="verified", method="GoPay") => {
    if (product.stock <= 0) return false;
    
    const transactionId = "TRX-" + Date.now();
    const payload = {
      transaction_id: transactionId, user_id: userId, product_id: product.id, quantity: 1, total_price: product.price,
      date: new Date().toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"}),
      time: new Date().toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"}),
      payment_status: paymentStatus, method: method
    };

    const transaction = {
      id: transactionId, type: "product", date: payload.date, time: payload.time,
      productId: product.id, productName: product.name, icon: product.icon, category: product.category,
      revenue: product.price, cogs: product.cost, profit: product.price - product.cost,
      userId, className: product.name, trainer: "RAW Store", status: "pending",
      paymentStatus, amount: product.price, method, branchId: "STORE",
    };

    const updateLocalUI = () => {
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, stock: p.stock - 1 } : p));
      setBookings(prev => [{ ...transaction, classId: null, description: product.description }, ...prev]);
    };

    if (!navigator.onLine) {
      updateLocalUI();
      setSyncQueue(prev => [...prev, { tempId: transactionId, endpoint: '/member/buy-product', data: payload }]);
      return transaction;
    }

    try {
      const response = await fetch(API_URL + '/member/buy-product', { method: 'POST', headers: API_HEADERS, body: JSON.stringify(payload) });
      const data = await response.json();
      if (response.ok && data.status === 'success') {
        updateLocalUI();
        return transaction;
      } else { alert("Gagal membeli: " + data.message); return false; }
    } catch (error) {
      updateLocalUI();
      setSyncQueue(prev => [...prev, { tempId: transactionId, endpoint: '/member/buy-product', data: payload }]);
      return transaction;
    }
  };  

// Universal profile update handlers (syncs data across all roles)
  const updateUser = (id, fields) => {
    // 1. Update UI Langsung
    setUsers(prev => prev.map(u => u.id === id ? {...u, ...fields} : u));
    if (user?.id === id) setUser(prev => ({...prev, ...fields}));

    // 2. Masukkan ke Antrean Sync (Background Sync)
    const syncItem = { 
      tempId: "USER_" + id + "_" + Date.now(), 
      endpoint: '/user/update-profile', 
      data: { id, ...fields } 
    };

    if (!navigator.onLine) {
      setSyncQueue(prev => [...prev, syncItem]);
    } else {
      fetch(API_URL + syncItem.endpoint, {
        method: 'POST',
        headers: API_HEADERS,
        body: JSON.stringify(syncItem.data)
      }).catch(() => {
        setSyncQueue(prev => [...prev, syncItem]);
      });
    }
  };

  const calculateExpiry = (planId) => {
  let d = new Date();
  if (planId === 'monthly') d.setMonth(d.getMonth() + 1);
  else if (planId === 'quarterly') d.setMonth(d.getMonth() + 3);
  else if (planId === 'annually') d.setFullYear(d.getFullYear() + 1);
  else d.setHours(d.getHours() + 24); // Per Visit berlaku 24 jam
  return d.toISOString();
};

  const updateTrainer = (id, fields) => {
    setTrainers(prev => prev.map(t => t.id === id ? {...t, ...fields} : t));
    // Also sync the linked user record name if name changed
    if (fields.name) {
      setUsers(prev => prev.map(u => u.trainerId === id ? {...u, name: fields.name} : u));
      if (user?.trainerId === id) setUser(prev => ({...prev, name: fields.name}));
    }
  };
  const addSecurityEvent = (event, device="App") => {
    setSecurityLog(prev => [{id:Date.now(), event, device, ip:"103.12.45.67", time: new Date()}, ...prev]);
  };

  //Reply ticket dari admin ke user, atau sebaliknya (dari user ke admin)
  const sendReply = async (id, text, senderRole = "admin") => {
    try {
      const res = await fetch(API_URL + '/admin/tickets/' + id + '/reply', {
        method: 'POST',
        headers: API_HEADERS,
        // Kirim 'from' agar Laravel tahu siapa yang membalas
        body: JSON.stringify({ text, from: senderRole })
      });
      
      const data = await res.json();
      
      if(res.ok && data.status === 'success') {
        setSupportTickets(prev => prev.map(t => t.id === id ? {
          ...t,
          status: data.data.status, // Ambil status terbaru dari database (open/replied)
          replies: data.data.replies // Ambil array replies terbaru dari database
        } : t));
        return true;
      }
    } catch(e) { 
      console.error("Chat Error:", e);
      return false;
    }
  };

  // --- 1. Deklarasi State (Paling Atas) ---
  const [syncQueue, setSyncQueue] = useState(() => {
    const saved = localStorage.getItem("raw_sync_queue");
    return saved ? JSON.parse(saved) : [];
  });

  // --- 2. Simpan ke LocalStorage saat Berubah ---
  useEffect(() => {
    localStorage.setItem("raw_sync_queue", JSON.stringify(syncQueue));
  }, [syncQueue]);

  // --- 3. Definisi Fungsi Update Profile (Di Luar State) ---
  const handleUpdateProfile = async (id, updatedData) => {
    // Update state lokal segera (Optimistic UI)
    updateUser(id, updatedData);

    const syncItem = { 
      tempId: 'USER_UPDATE_' + Date.now(), 
      endpoint: '/user/update-profile', 
      data: { id, ...updatedData } 
    };

    if (!navigator.onLine) {
      setSyncQueue(prev => [...prev, syncItem]);
      alert("Offline: Perubahan disimpan di HP dan akan disync nanti.");
      return;
    }

    try {
      const res = await fetch(API_URL + syncItem.endpoint, {
        method: 'POST',
        headers: API_HEADERS,
        body: JSON.stringify(syncItem.data)
      });
      if (!res.ok) throw new Error();
    } catch {
      // Jika server error/down, masukkan ke antrean sync
      setSyncQueue(prev => [...prev, syncItem]);
    }
  };

  const processSyncQueue = useCallback(async () => {
  if (!navigator.onLine || syncQueue.length === 0) return;
  
  // Ambil item pertama dari antrean
  const item = syncQueue[0];
  try {
    const res = await fetch(API_URL + item.endpoint, {
      method: 'POST',
      headers: API_HEADERS,
      body: JSON.stringify(item.data)
    });
    if (res.ok) {
      setSyncQueue(prev => prev.filter(q => q.tempId !== item.tempId));
    }
  } catch {
    console.error("Sync failed:", item.tempId);
  }
}, [syncQueue]);

// Pantau status koneksi
useEffect(() => {
  window.addEventListener('online', processSyncQueue);
  return () => window.removeEventListener('online', processSyncQueue);
}, [processSyncQueue, syncQueue]);

  const sharedProps={
    user, users, setUsers, updateUser,
    notifications, setNotifications,
    trainers, setTrainers, updateTrainer, updateTrainerStatus,
    classes, setClasses,
    bookings, setBookings,
    transfers, setTransfers,
    products, setProducts, sales, processPurchase,
    trainerLogs, setTrainerLogs,
    broadcasts, setBroadcasts,
    fitnessProgress, setFitnessProgress,
    gymSettings, setGymSettings,
    securityLog, addSecurityEvent,
    supportTickets, setSupportTickets,
    sendReply,
    badges, setBadges,
    reviews, setReviews, getTrainerStats,
    clientNotes, setClientNotes,
    syncQueue, setSyncQueue, handleUpdateProfile,
    branches, setBranches,
    plans, setPlans,
    onLogin:handleLogin, onRegister:handleRegister, onLogout:handleLogout
  };

  return(
    <Shell>
      {mode==="explore" && <ExploreApp   {...sharedProps} users={users}/>}
      {mode==="member"  && <MemberApp    {...sharedProps} plans={plans}/>}
      {mode==="admin"   && <AdminApp     {...sharedProps}/>}
      {mode==="trainer" && <TrainerApp   {...sharedProps} users={users} plans={plans}/>}
    </Shell>
  );
}

function Shell({children}){
  return(
    <div style={{width:"100%",maxWidth:430,minHeight:"100vh",background:T.bg,margin:"0 auto",fontFamily:F.body,position:"relative",overflow:"hidden",color:T.text}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;}
        ::-webkit-scrollbar{display:none;}
        input,select,textarea{outline:none;font-family:'DM Sans',sans-serif;}
        button{cursor:pointer;border:none;font-family:'DM Sans',sans-serif;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(18px);}to{opacity:1;transform:translateY(0);}}
        @keyframes popIn{0%{transform:scale(0.4);opacity:0;}70%{transform:scale(1.06);}100%{transform:scale(1);opacity:1;}}
        @keyframes slideUp{from{transform:translateY(100%);opacity:0;}to{transform:translateY(0);opacity:1;}}
        .fu{animation:fadeUp 0.38s ease both;}
        .pi{animation:popIn 0.45s cubic-bezier(.175,.885,.32,1.275) both;}
        .su{animation:slideUp 0.32s cubic-bezier(.25,.46,.45,.94) both;}
        .rp:active{transform:scale(0.95);transition:transform .08s;}
      `}</style>
      <AndroidInstallBanner />
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   EXPLORE APP (GUEST VIEW)
═══════════════════════════════════════════════════════════════ */
function ExploreApp({trainers,classes,users,products,onLogin,onRegister,branches,updateUser,getTrainerStats}){
  const [tab,setTab]=useState("discover");
  const [loginModal,setLoginModal]=useState(false);
  const [regModal,setRegModal]=useState(false);
  const [forgotModal,setForgotModal]=useState(false);

  // Tangkap URL dari email
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('reset_token');
    const email = params.get('email');
    if (token && email) {
      const newPass = prompt("Masukkan password baru Anda:");
      if (newPass && newPass.length >= 4) {
        fetch(API_URL + '/reset-password', {
          method: 'POST',
          headers: API_HEADERS,
          body: JSON.stringify({ token, email, password: newPass })
        }).then(r=>r.json()).then(data => {
          alert(data.message);
          window.location.href = "/"; // Bersihkan URL setelah sukses
        });
      }
    }
  }, []);

  return(
    <div>
      {loginModal&&<LoginModal users={users} onLogin={onLogin} onClose={()=>setLoginModal(false)} onSwitchToReg={()=>{setLoginModal(false);setRegModal(true);}} onSwitchToForgot={()=>{setLoginModal(false);setForgotModal(true);}}/>}
      {regModal&&<RegisterModal branches={branches} users={users} onRegister={(u)=>{setRegModal(false);onRegister(u);}} onClose={()=>setRegModal(false)} onSwitchToLogin={()=>{setRegModal(false);setLoginModal(true);}}/>}
      {forgotModal&&<ForgotPasswordModal onClose={()=>setForgotModal(false)} onSwitchToLogin={()=>{setForgotModal(false);setLoginModal(true);}}/>}

      <div style={{paddingBottom:90}}>
        {tab==="discover"&&<ExploreDiscover branches={branches} classes={classes} trainers={trainers} users={users} onLogin={()=>setLoginModal(true)} onRegister={()=>setRegModal(true)} getTrainerStats={getTrainerStats}/>}
        {tab==="branches"&&<ExploreBranches branches={branches} classes={classes} trainers={trainers} onLogin={()=>setLoginModal(true)} getTrainerStats={getTrainerStats}/>}
        {tab==="classes" &&<ExploreClasses branches={branches} classes={classes} trainers={trainers} onLogin={()=>setLoginModal(true)}/>}
        {tab==="trainers"&&<ExploreTrainers trainers={trainers} branches={branches} onLogin={()=>setLoginModal(true)} getTrainerStats={getTrainerStats}/>}
      </div>
      <BNav items={[{id:"discover",icon:"⚡",label:"Discover"},{id:"branches",icon:"📍",label:"Branches"},{id:"classes",icon:"📅",label:"Classes"},{id:"trainers",icon:"🏋️",label:"Trainers"}]} active={tab} onChange={setTab} accent={T.lime}/>
    </div>
  );
}

function ExploreDiscover({branches,classes,trainers,users,onLogin,onRegister,getTrainerStats}){
  const [activeBranch,setActiveBranch]=useState(null);
  const branch=activeBranch?branches.find(b=>b.id===activeBranch):null;

  if(branch) return <BranchDetail branch={branch} classes={classes} trainers={trainers} onBack={()=>setActiveBranch(null)} onLogin={onRegister||onLogin} getTrainerStats={getTrainerStats}/>;

  // 🟢 LOGIKA STATISTIK DINAMIS DARI DATABASE
  // 1. Total Member Aktif
  const activeMembersCount = users ? users.filter(u => u.role === 'member').length : 0;
  // (Opsional: Tambah base number jika member di DB masih sedikit agar terlihat ramai)
  const displayMembers = 1400 + activeMembersCount; 

  // 2. Total Kelas Aktif Asli
  const activeClassesCount = classes.filter(c => c.status === 'active').length;

  // 3. Rata-rata Rating Gym dari Semua Trainer Asli
  const allRatings = trainers.map(t => parseFloat(getTrainerStats(t.id).avg)).filter(r => !isNaN(r) && r > 0);
  const avgGymRating = allRatings.length > 0 ? (allRatings.reduce((a,b)=>a+b,0) / allRatings.length).toFixed(1) : "4.9";

  return(
    <div>
      <div style={{padding:"0",position:"relative",overflow:"hidden",minHeight:320,display:"flex",flexDirection:"column",justifyContent:"flex-end"}}>
        <div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse 100% 80% at 50% 0%, ${T.lime}18 0%, transparent 65%), radial-gradient(ellipse 60% 50% at 90% 100%, #C8FF0012 0%, transparent 60%), ${T.bg}`}}/>
        <div style={{position:"absolute",top:0,left:0,right:0,bottom:0,backgroundImage:"radial-gradient(circle at 1px 1px, #ffffff06 1px, transparent 0)",backgroundSize:"28px 28px"}}/>
        <div style={{padding:"60px 24px 28px",position:"relative",zIndex:1}}>
          <div className="fu" style={{display:"inline-flex",alignItems:"center",gap:8,background:T.card,borderRadius:20,padding:"8px 16px",border:`1px solid ${T.border}`,marginBottom:16}}>
            <span style={{fontSize:18}}>⚡</span>
            <span style={{fontFamily:F.mono,fontSize:10,color:T.lime,letterSpacing:3,fontWeight:700}}>RAW GYM NETWORK</span>
          </div>
          <div className="fu" style={{animationDelay:".06s",fontFamily:F.display,fontSize:60,color:T.text,letterSpacing:3,lineHeight:.9,marginBottom:12}}>
            NO EXCUSES.<br/><span style={{color:T.lime}}>ONLY</span><br/>RESULTS.
          </div>
          <div className="fu" style={{animationDelay:".1s",fontSize:14,color:T.muted,marginBottom:20,maxWidth:280}}>
            {branches.length} premium branches in Bali. Join {displayMembers.toLocaleString("en")}+ active members today.
          </div>
         <div className="fu" style={{animationDelay:".14s",display:"flex",gap:10}}>
            <button onClick={onRegister} style={{padding:"12px 24px",borderRadius:14,fontFamily:F.display,fontSize:18,letterSpacing:2,background:T.lime,color:T.bg,fontWeight:700,boxShadow:`0 6px 24px ${T.lime}44`}}>JOIN NOW</button>
            <button onClick={onLogin} style={{padding:"12px 20px",borderRadius:14,fontFamily:F.display,fontSize:16,letterSpacing:1,background:"transparent",color:T.text,border:`1px solid ${T.borderHi}`}}>LOGIN</button>
          </div>
        </div>
      </div>

      <div className="fu" style={{animationDelay:".18s",display:"flex",background:T.card,borderTop:`1px solid ${T.border}`,borderBottom:`1px solid ${T.border}`}}>
        {/* 🟢 RENDER ANGKA DINAMIS DI SINI */}
        {[{v:`${branches.length}`,l:"Branches"},{v:displayMembers.toLocaleString("en"),l:"Members"},{v:`${activeClassesCount}`,l:"Classes/Wk"},{v:`${avgGymRating}★`,l:"Rating"}].map((s,i)=>(
          <div key={i} style={{flex:1,padding:"14px 8px",textAlign:"center",borderRight:i<3?`1px solid ${T.border}`:"none"}}>
            <div style={{fontFamily:F.display,fontSize:22,color:T.lime,letterSpacing:1}}>{s.v}</div>
            <div style={{fontSize:10,color:T.muted,fontWeight:500}}>{s.l}</div>
          </div>
        ))}
      </div>

      <div style={{padding:"24px 20px 0"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <SecTitle title="OUR BRANCHES" size={24}/>
          <div style={{fontSize:12,color:T.lime,fontWeight:700,cursor:"pointer"}}>See all →</div>
        </div>
        {branches.map((b,i)=><BranchCard key={b.id} branch={b} delay={i*.06} onTap={()=>setActiveBranch(b.id)}/>)}
      </div>
    </div>
  );
}

function ExploreBranches({branches,classes,trainers,onLogin,getTrainerStats}){
  const [sel,setSel]=useState(null);
  const branch=sel?branches.find(b=>b.id===sel):null;
  if(branch) return <BranchDetail branch={branch} classes={classes} trainers={trainers} onBack={()=>setSel(null)} onLogin={onLogin} getTrainerStats={getTrainerStats}/>;
  return(
    <div style={{padding:"52px 20px 0"}}>
      <SecTitle title="ALL BRANCHES" size={30}/>
      <div style={{fontSize:14,color:T.muted,marginBottom:20}}>{branches.length} premium locations</div>
      {branches.map((b,i)=><BranchCard key={b.id} branch={b} delay={i*.06} onTap={()=>setSel(b.id)}/>)}
    </div>
  );
}

function ExploreClasses({branches,classes,trainers,onLogin}){
  const [selBranch,setSelBranch]=useState("ALL");
  const [selDate,setSelDate]=useState(DYNAMIC_DAYS[0]);
  const [selCat,setSelCat]=useState("ALL");
  const cats=["ALL","HIIT","Yoga","Cardio","Boxing","Pilates","Dance","Strength","Kids"];
  const filtered=classes.filter(c=> (selBranch==="ALL"||c.branchId===selBranch) && c.day===selDate.dayName && (selCat==="ALL"||c.category===selCat));

  return(
    <div style={{padding:"52px 20px 0"}}>
      <SecTitle title="CLASS SCHEDULE" size={30}/>
      <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:4,marginBottom:10}}>
        {[{id:"ALL",name:"All",...{color:T.lime}}, {id:"ONLINE",name:"Online",color:T.blue}, ...branches.map(b=>({id:b.id,name:b.short,color:b.color}))].map(b=>(
          <div key={b.id} className="rp" onClick={()=>setSelBranch(b.id)} style={{padding:"6px 14px",borderRadius:20,fontSize:11,fontWeight:700,whiteSpace:"nowrap",background:selBranch===b.id?b.color:"transparent",color:selBranch===b.id?T.bg:T.muted,border:`1px solid ${selBranch===b.id?b.color:T.border}`,cursor:"pointer",transition:"all .2s"}}>{b.name}</div>
        ))}
      </div>
      <DaySel selDate={selDate} setSelDate={setSelDate} accent={T.lime} />
      <div style={{display:"flex",gap:6,overflowX:"auto",marginTop:10,paddingBottom:4}}>
        {cats.map(c=>(
          <div key={c} className="rp" onClick={()=>setSelCat(c)} style={{padding:"5px 12px",borderRadius:20,fontSize:11,fontWeight:700,whiteSpace:"nowrap",background:selCat===c?T.lime:"transparent",color:selCat===c?T.bg:T.muted,border:`1px solid ${selCat===c?T.lime:T.border}`,cursor:"pointer",transition:"all .2s"}}>{c}</div>
        ))}
      </div>
      <div style={{marginTop:12}}>
        {filtered.length===0?<Empty icon="😴" title="NO CLASSES" sub="Try another filter"/>
          :filtered.map((cls,i)=>{
            const tr=trainers.find(t=>t.id===cls.trainerId);
            const br=branches.find(b=>b.id===cls.branchId) || {color:T.blue, short:"ONLINE"};
            return(
              <GuestClassCard key={cls.id} cls={{...cls,trainer:tr?.name}} branch={br} delay={i*.04} onBook={onLogin}/>
            );
          })
        }
      </div>
    </div>
  );
}

function ExploreTrainers({trainers,branches,onLogin,getTrainerStats}){
  const [selBranch,setSelBranch]=useState("ALL");
  const filtered=trainers.filter(t=>selBranch==="ALL"||t.branchId===selBranch);
  return(
    <div style={{padding:"52px 20px 0"}}>
      <SecTitle title="OUR COACHES" size={30}/>
      <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:4,marginBottom:16}}>
        {[{id:"ALL",name:"All",color:T.lime},...branches.map(b=>({id:b.id,name:b.short,color:b.color}))].map(b=>(
          <div key={b.id} className="rp" onClick={()=>setSelBranch(b.id)} style={{padding:"6px 14px",borderRadius:20,fontSize:11,fontWeight:700,whiteSpace:"nowrap",background:selBranch===b.id?b.color:"transparent",color:selBranch===b.id?T.bg:T.muted,border:`1px solid ${selBranch===b.id?b.color:T.border}`,cursor:"pointer",transition:"all .2s"}}>{b.name}</div>
        ))}
      </div>
      {filtered.map((tr,i)=>{
        const br=branches.find(b=>b.id===tr.branchId);
        return <TrainerCard key={tr.id} trainer={tr} branch={br} delay={i*.06} getTrainerStats={getTrainerStats}/>;
      })}
    </div>
  );
}

function BranchCard({branch,delay,onTap}){
  return(
    <div className="fu rp" onClick={onTap} style={{animationDelay:`${delay}s`,background:T.card,borderRadius:20,marginBottom:12,border:`1px solid ${T.border}`,overflow:"hidden",cursor:"pointer",position:"relative"}}>
      <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:branch.color}}/>
      <div style={{padding:"18px 18px 14px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div style={{display:"flex",gap:12,alignItems:"center"}}>
            <div style={{width:52,height:52,borderRadius:14,background:branch.color+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,border:`1px solid ${branch.color}44`}}>{branch.cover}</div>
            <div>
              <div style={{fontFamily:F.display,fontSize:18,color:T.text,letterSpacing:1.5,lineHeight:1}}>{branch.name}</div>
              <div style={{fontSize:12,color:T.muted,marginTop:3}}>{branch.area}</div>
              <div style={{display:"flex",gap:6,marginTop:5}}>
                {branch.tags.map(t=><span key={t} style={{fontSize:9,fontWeight:700,color:branch.color,background:branch.color+"18",padding:"2px 8px",borderRadius:10,border:`1px solid ${branch.color}44`,fontFamily:F.mono,letterSpacing:1}}>{t}</span>)}
              </div>
            </div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontFamily:F.display,fontSize:20,color:T.yellow,letterSpacing:1}}>★ {branch.rating}</div>
            <div style={{fontSize:11,color:T.muted}}>{branch.reviews} revs</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BranchDetail({branch,classes,trainers,onBack,onLogin,getTrainerStats}){
  const [tab,setTab]=useState("overview");
  const branchClasses=classes.filter(c=>c.branchId===branch.id);
  const branchTrainers=trainers.filter(t=>t.branchId===branch.id);
  const [selDate,setSelDate]=useState(DYNAMIC_DAYS[0]);

  return(
    <div className="su">
      <div style={{background:`linear-gradient(160deg,${branch.color}22,${T.bg})`,padding:"52px 20px 20px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-40,right:-40,width:160,height:160,borderRadius:"50%",background:branch.color+"18",filter:"blur(50px)"}}/>
        <div onClick={onBack} style={{display:"inline-flex",alignItems:"center",gap:6,color:T.muted,fontSize:13,cursor:"pointer",marginBottom:16,fontWeight:600}}>← Back</div>
        <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
          <div style={{width:60,height:60,borderRadius:16,background:branch.color+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,border:`1px solid ${branch.color}44`}}>{branch.cover}</div>
          <div>
            <div style={{fontFamily:F.display,fontSize:26,color:T.text,letterSpacing:2,lineHeight:1}}>{branch.name}</div>
            <div style={{fontSize:13,color:T.muted,marginTop:4}}>{branch.address}</div>
            <div style={{display:"flex",gap:8,marginTop:8}}>
              <Chip color={T.yellow} text={`★ ${branch.rating}`}/>
              <Chip color={branch.color} text={`${branch.members} MEMBERS`}/>
            </div>
          </div>
        </div>
        <div style={{display:"flex",gap:6,marginTop:20}}>
          {["overview","classes","trainers"].map(t=>(
            <div key={t} className="rp" onClick={()=>setTab(t)} style={{padding:"7px 16px",borderRadius:20,fontSize:12,fontWeight:700,background:tab===t?branch.color:"transparent",color:tab===t?T.bg:T.muted,border:`1px solid ${tab===t?branch.color:T.border}`,cursor:"pointer",transition:"all .2s",letterSpacing:.5,textTransform:"uppercase"}}>{t}</div>
          ))}
        </div>
      </div>

      <div style={{padding:"16px 20px",paddingBottom:100}}>
        {tab==="overview"&&(
          <div>
            <div style={{display:"flex",gap:10,marginBottom:16}}>
              {[{i:"🕐",l:"HOURS",v:branch.hours},{i:"📞",l:"PHONE",v:branch.phone}].map((s,i)=>(
                <div key={i} style={{flex:1,background:T.card,borderRadius:14,padding:14,border:`1px solid ${T.border}`}}>
                  <div style={{fontSize:20,marginBottom:6}}>{s.i}</div>
                  <div style={{fontSize:9,color:T.muted,fontFamily:F.mono,letterSpacing:1,marginBottom:2}}>{s.l}</div>
                  <div style={{fontSize:13,fontWeight:600,color:T.text}}>{s.v}</div>
                </div>
              ))}
            </div>
            <div style={{background:T.card,borderRadius:16,padding:16,marginBottom:16,border:`1px solid ${T.border}`}}>
              <div style={{fontSize:11,color:T.muted,fontFamily:F.mono,letterSpacing:2,marginBottom:12}}>FACILITIES</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {branch.facilities.map(f=><div key={f} style={{background:branch.color+"18",color:branch.color,border:`1px solid ${branch.color}33`,borderRadius:20,padding:"5px 12px",fontSize:12,fontWeight:600}}>✓ {f}</div>)}
              </div>
            </div>
            <button onClick={onLogin} style={{width:"100%",padding:16,borderRadius:14,fontFamily:F.display,fontSize:18,letterSpacing:2,background:branch.color,color:T.bg,fontWeight:700}}>JOIN THIS BRANCH</button>
          </div>
        )}
        {tab==="classes"&&(
          <div>
            <DaySel selDate={selDate} setSelDate={setSelDate} accent={branch.color} />
            <div style={{marginTop:12}}>
              {branchClasses.filter(c=>c.day===selDate.dayName).length===0
                ?<Empty icon="😴" title="NO CLASSES" sub="Try another day"/>
                :branchClasses.filter(c=>c.day===selDate.dayName).map((cls,i)=><GuestClassCard key={cls.id} cls={cls} delay={i*.05} onBook={onLogin} branch={branch}/>)
              }
            </div>
          </div>
        )}
        {tab==="trainers"&&(
          <div>
            {branchTrainers.map((t,i)=><TrainerCard key={t.id} trainer={t} branch={branch} delay={i*.06} getTrainerStats={getTrainerStats}/>)}
            <button onClick={onLogin} style={{width:"100%",marginTop:8,padding:14,borderRadius:14,fontFamily:F.display,fontSize:16,letterSpacing:2,background:branch.color,color:T.bg,fontWeight:700}}>BOOK PRIVATE SESSION</button>
          </div>
        )}
      </div>
    </div>
  );
}

function TrainerCard({trainer,branch,delay=0,getTrainerStats}){
  return(
    <div className="fu" style={{animationDelay:`${delay}s`,background:T.card,borderRadius:18,padding:16,marginBottom:12,border:`1px solid ${T.border}`}}>
      <div style={{display:"flex",gap:14,alignItems:"flex-start"}}>
        <div style={{width:56,height:56,borderRadius:16,background:branch?branch.color+"22":T.cardHi,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0,border:`1px solid ${branch?branch.color+"44":T.border}`}}>{trainer.avatar}</div>
        <div style={{flex:1}}>
          <div style={{fontFamily:F.display,fontSize:20,color:T.text,letterSpacing:1.5,lineHeight:1}}>{trainer.name}</div>
          <div style={{fontSize:12,color:T.muted,marginTop:3}}>{trainer.specialty}</div>
          <div style={{fontSize:12,color:T.yellow, fontWeight:700}}>⭐ {getTrainerStats(trainer.id).avg} ({getTrainerStats(trainer.id).count})</div>
          <div style={{fontSize:12,color:T.muted,marginTop:8,fontStyle:"italic",lineHeight:1.4}}>"{trainer.bio}"</div>
        </div>
      </div>
    </div>
  );
}

function GuestClassCard({cls, branch, delay, onBook}){ // <-- Tambahkan parameter branch
  const pct=Math.round(((cls.total-cls.slots)/cls.total)*100);
  const full=cls.slots===0;
  const cancel=cls.status==="cancelled";
  const isOnline = cls.branchId === "ONLINE";

  return(
    <div className="fu" style={{animationDelay:`${delay}s`,background:T.card,borderRadius:18,padding:16,marginBottom:12,border:`1px solid ${cancel?"#FF313144":isOnline?T.blue+"44":T.border}`,opacity:cancel?.5:1,position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:0,left:0,width:`${pct}%`,height:2,background:cls.color}}/>
      {cancel&&<div style={{position:"absolute",top:10,right:10,background:"#FF313122",color:T.red,fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:8,fontFamily:F.mono}}>CANCELLED</div>}
      <div style={{display:"flex",gap:14,alignItems:"flex-start"}}>
        <div style={{width:50,height:50,borderRadius:14,background:cls.color+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0,border:`1px solid ${cls.color}44`}}>{cls.icon}</div>
        <div style={{flex:1}}>
          <div style={{display:"flex",justifyContent:"space-between"}}>
            <div>
              <div style={{fontFamily:F.display,fontSize:19,color:T.text,letterSpacing:1.5,lineHeight:1}}>
                {cls.name} {isOnline && <span style={{fontSize:10, color:T.blue, verticalAlign:"middle"}}>🌐 VIRTUAL</span>}
              </div>
              {/* Layout Durasi dan Nama Cabang digabungkan di sini */}
              <div style={{display:"flex", alignItems:"center", gap:8, marginTop:4}}>
                <div style={{fontSize:12,color:T.muted}}>{cls.duration}</div>
                {branch && !isOnline && (
                  <div style={{fontSize:9,fontWeight:700,color:branch.color,background:branch.color+"18",padding:"2px 6px",borderRadius:8,border:`1px solid ${branch.color}44`,fontFamily:F.mono}}>
                    {branch.short}
                  </div>
                )}
              </div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontFamily:F.display,fontSize:21,color:cls.color,letterSpacing:1}}>{cls.time}</div>
              <div style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:10,fontFamily:F.mono,background:cls.intensity==="HIGH"?"#FF313122":cls.intensity==="MED"?"#FF5C0022":"#00FF8522",color:cls.intensity==="HIGH"?T.red:cls.intensity==="MED"?T.orange:T.green,letterSpacing:1,marginTop:2}}>{cls.intensity}</div>
            </div>
          </div>
          {!cancel&&(
            <div style={{display:"flex",alignItems:"center",gap:10,marginTop:10}}>
              <div style={{flex:1,height:3,background:T.border,borderRadius:4,overflow:"hidden"}}>
                <div style={{width:`${pct}%`,height:"100%",background:cls.color,borderRadius:4}}/>
              </div>
              <div style={{fontSize:11,color:full?T.red:T.muted,fontWeight:700}}>{full?"FULL":`${cls.slots} slots`}</div>
              <button onClick={onBook} style={{padding:"6px 14px",borderRadius:10,fontSize:11,fontWeight:700,background:full?T.border:cls.color,color:full?T.dim:T.bg}}>
                {full?"FULL":"BOOK →"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   LOGIN MODAL
═══════════════════════════════════════════════════════════════ */
function LoginModal({onLogin,onClose,users,onSwitchToReg,onSwitchToForgot}){
  const [email,setEmail]=useState("");
  const [pass,setPass]=useState("");
  const [err,setErr]=useState("");
  const [loading,setLoading]=useState(false);
  const [showP,setShowP]=useState(false);
  const quick=[
    {label:"Member",  color:T.cyan,   icon:"💪",email:"alex@gym.com"},
    {label:"Admin",   color:T.orange, icon:"🛡️",email:"admin@gym.com"},
    {label:"Trainer", color:T.lime,   icon:"🏋️",email:"coach@gym.com"},
  ];
  const doLogin=()=>{
    setErr("");setLoading(true);
    setTimeout(()=>{
      // Search from live users state so newly added members can also login
      const allUsers = users || USERS_INIT;
      const u=allUsers.find(u=>u.email===email.trim()&&u.pass===pass);
      if(u)onLogin(u); else setErr("Invalid email or password");
      setLoading(false);
    },600);
  };
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:200,display:"flex",alignItems:"flex-end",justifyContent:"center",backdropFilter:"blur(12px)"}} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="su" style={{background:T.surface,borderRadius:"24px 24px 0 0",width:"100%",maxWidth:430,padding:"28px 24px 44px",border:`1px solid ${T.border}`,borderBottom:"none"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <div style={{fontFamily:F.display,fontSize:28,color:T.text,letterSpacing:2}}>LOGIN</div>
          <div onClick={onClose} style={{width:36,height:36,borderRadius:"50%",background:T.card,border:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:T.muted,fontSize:16}}>✕</div>
        </div>
        <div style={{display:"flex",gap:8,marginBottom:20}}>
          {quick.map(q=>(
            <div key={q.label} className="rp" onClick={()=>{setEmail(q.email);setPass("123");setErr("");}} style={{flex:1,background:q.color+"18",border:`1px solid ${q.color}44`,borderRadius:12,padding:"10px 8px",textAlign:"center",cursor:"pointer"}}>
              <div style={{fontSize:20,marginBottom:2}}>{q.icon}</div>
              <div style={{fontSize:10,fontWeight:700,color:q.color,letterSpacing:1,fontFamily:F.mono}}>{q.label}</div>
            </div>
          ))}
        </div>
        <div style={{marginBottom:12}}>
          <div style={{fontSize:11,color:T.muted,fontFamily:F.mono,letterSpacing:2,marginBottom:6}}>EMAIL</div>
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="email@example.com" style={{width:"100%",background:T.card,border:`1px solid ${email?T.lime+"66":T.border}`,borderRadius:12,padding:"13px 16px",color:T.text,fontSize:15,transition:"border .2s"}}/>
        </div>
       <div style={{marginBottom:16}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
            <div style={{fontSize:11,color:T.muted,fontFamily:F.mono,letterSpacing:2}}>PASSWORD</div>
            {onSwitchToForgot && <div onClick={onSwitchToForgot} style={{fontSize:11,color:T.lime,fontWeight:700,cursor:"pointer"}}>Forgot?</div>}
          </div>
          <div style={{position:"relative"}}>
            <input value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doLogin()} type={showP?"text":"password"} placeholder="••••••••" style={{width:"100%",background:T.card,border:`1px solid ${pass?T.lime+"66":T.border}`,borderRadius:12,padding:"13px 46px 13px 16px",color:T.text,fontSize:15,transition:"border .2s"}}/>
            <div onClick={()=>setShowP(!showP)} style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",cursor:"pointer",fontSize:16,color:T.muted}}>{showP?"🙈":"👁️"}</div>
          </div>
        </div>
        {err&&<div style={{background:"#FF313118",border:"1px solid #FF313144",borderRadius:10,padding:"9px 14px",marginBottom:12,fontSize:13,color:T.red,fontWeight:600}}>⚠️ {err}</div>}
        <button onClick={doLogin} disabled={loading||!email||!pass} style={{width:"100%",padding:15,borderRadius:12,fontFamily:F.display,fontSize:19,letterSpacing:2,background:loading||!email||!pass?T.border:T.lime,color:loading||!email||!pass?T.dim:T.bg,transition:"all .3s"}}>
          {loading?"VERIFYING...":"LOGIN"}
        </button>
        {onSwitchToReg && (
          <div style={{textAlign:"center", marginTop:16, fontSize:13, color:T.muted}}>
            No member account? <span onClick={onSwitchToReg} style={{color:T.lime, fontWeight:700, cursor:"pointer"}}>Register here</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   REGISTER MODAL (NEW)
═══════════════════════════════════════════════════════════════ */
function RegisterModal({onRegister,onClose,branches,users,onSwitchToLogin}){
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [pass,setPass]=useState("");
  const [branchId,setBranchId]=useState(branches[0]?.id||"B1");
  const [err,setErr]=useState("");
  const [loading,setLoading]=useState(false);

  const doRegister=()=>{
    setErr("");
    if (!email.toLowerCase().endsWith("@gmail.com")) {
      setErr("Only accept email from @gmail.com");
      return;
    }
    setLoading(true);
    setTimeout(()=>{
      const newUser = { name: name.trim(), email: email.trim(), pass: pass, branchId: branchId };
      onRegister(newUser);
      setLoading(false);
    },600);
  };

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:200,display:"flex",alignItems:"flex-end",justifyContent:"center",backdropFilter:"blur(12px)"}} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="su" style={{background:T.surface,borderRadius:"24px 24px 0 0",width:"100%",maxWidth:430,padding:"28px 24px 44px",border:`1px solid ${T.border}`,borderBottom:"none"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <div style={{fontFamily:F.display,fontSize:28,color:T.text,letterSpacing:2}}>REGISTER</div>
          <div onClick={onClose} style={{width:36,height:36,borderRadius:"50%",background:T.card,border:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:T.muted,fontSize:16}}>✕</div>
        </div>
        
        <div style={{marginBottom:12}}>
          <div style={{fontSize:11,color:T.muted,fontFamily:F.mono,letterSpacing:2,marginBottom:6}}>FULL NAME</div>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Alex Fitria" style={{width:"100%",background:T.card,border:`1px solid ${name?T.lime+"66":T.border}`,borderRadius:12,padding:"13px 16px",color:T.text,fontSize:15}}/>
        </div>
        
        <div style={{marginBottom:12}}>
          <div style={{fontSize:11,color:T.muted,fontFamily:F.mono,letterSpacing:2,marginBottom:6}}>EMAIL</div>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="email@example.com" style={{width:"100%",background:T.card,border:`1px solid ${email?T.lime+"66":T.border}`,borderRadius:12,padding:"13px 16px",color:T.text,fontSize:15}}/>
        </div>

        <div style={{marginBottom:12}}>
          <div style={{fontSize:11,color:T.muted,fontFamily:F.mono,letterSpacing:2,marginBottom:6}}>HOME BRANCH</div>
          <select value={branchId} onChange={e=>setBranchId(e.target.value)} style={{width:"100%",background:T.card,border:`1px solid ${T.lime+"66"}`,borderRadius:12,padding:"13px 16px",color:T.text,fontSize:15,colorScheme:"dark",outline:"none"}}>
            {branches.map(b=><option key={b.id} value={b.id}>{b.cover} {b.name}</option>)}
          </select>
        </div>

        <div style={{marginBottom:16}}>
          <div style={{fontSize:11,color:T.muted,fontFamily:F.mono,letterSpacing:2,marginBottom:6}}>PASSWORD</div>
          <input value={pass} onChange={e=>setPass(e.target.value)} type="password" placeholder="••••••••" style={{width:"100%",background:T.card,border:`1px solid ${pass?T.lime+"66":T.border}`,borderRadius:12,padding:"13px 16px",color:T.text,fontSize:15}}/>
        </div>

        {err&&<div style={{background:"#FF313118",border:"1px solid #FF313144",borderRadius:10,padding:"9px 14px",marginBottom:12,fontSize:13,color:T.red,fontWeight:600}}>⚠️ {err}</div>}
        
        <button onClick={doRegister} disabled={loading||!email||!pass||!name} style={{width:"100%",padding:15,borderRadius:12,fontFamily:F.display,fontSize:19,letterSpacing:2,background:loading||!email||!pass||!name?T.border:T.lime,color:loading||!email||!pass||!name?T.dim:T.bg,transition:"all .3s"}}>
          {loading?"CREATING ACCOUNT...":"SIGN UP"}
        </button>
        
        <div style={{textAlign:"center", marginTop:16, fontSize:13, color:T.muted}}>
          Already have an account? <span onClick={onSwitchToLogin} style={{color:T.lime, fontWeight:700, cursor:"pointer"}}>Login here</span>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FORGOT PASSWORD MODAL (NEW)
═══════════════════════════════════════════════════════════════ */
function ForgotPasswordModal({onClose, onSwitchToLogin}) {
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const doReset = async () => {
    setErr("");
    if (!email.toLowerCase().endsWith("@gmail.com")) {
      setErr("Hanya menerima email @gmail.com"); return;
    }
    setLoading(true);
    try {
      const res = await fetch(API_URL + '/forgot-password', {
        method: 'POST',
        headers: API_HEADERS,
        body: JSON.stringify({ email: email.trim() })
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        setSuccess(true);
      } else {
        setErr(data.message || "Gagal mengirim link.");
      }
    } catch(e) {
      setErr("Gagal terhubung ke server.");
    }
    setLoading(false);
  };

  return (
    <Modal onClose={onClose}>
      <div style={{padding:"28px 24px 40px"}}>
        <div style={{fontFamily:F.display,fontSize:28,color:T.text,letterSpacing:2,marginBottom:20}}>RESET PASSWORD</div>
        {success ? (
          <div style={{textAlign:"center"}}>
            <div className="pi" style={{fontSize:50, marginBottom:10}}>📧</div>
            <div style={{fontSize:18, fontWeight:700, color:T.green, marginBottom:10}}>Link Terkirim!</div>
            <div style={{fontSize:13, color:T.muted, marginBottom:24}}>Cek inbox Gmail Anda untuk link reset.</div>
            <button onClick={onSwitchToLogin} style={{width:"100%",padding:15,borderRadius:12,fontFamily:F.display,fontSize:19,letterSpacing:2,background:T.lime,color:T.bg,fontWeight:700}}>LOGIN SEKARANG</button>
          </div>
        ) : (
          <>
            <div style={{fontSize:13, color:T.muted, marginBottom:20}}>Masukkan Gmail Anda, kami akan mengirimkan link reset.</div>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="email@gmail.com" style={{width:"100%",background:T.card,border:`1px solid ${email?T.lime+"66":T.border}`,borderRadius:12,padding:"13px 16px",color:T.text,fontSize:15,marginBottom:16}}/>
            {err&&<div style={{background:"#FF313118",border:"1px solid #FF313144",borderRadius:10,padding:"9px 14px",marginBottom:12,fontSize:13,color:T.red,fontWeight:600}}>⚠️ {err}</div>}
            <button onClick={doReset} disabled={loading||!email} style={{width:"100%",padding:15,borderRadius:12,fontFamily:F.display,fontSize:19,letterSpacing:2,background:loading||!email?T.border:T.lime,color:loading||!email?T.dim:T.bg,fontWeight:700}}>{loading?"MENGIRIM...":"KIRIM LINK"}</button>
          </>
        )}
      </div>
    </Modal>
  );
}

/* ═══════════════════════════════════════════════════════════════
   NOTIFICATIONS
═══════════════════════════════════════════════════════════════ */
function NotificationModal({notifications, setNotifications, onClose, onNavigate, accent}){
 const handleItemClick = (n) => {
    // 1. Logika untuk Broadcast (yang sudah kita buat)
    if (n.type === 'broadcast') {
      const rawId = Number(String(n.id).replace("BROADCAST_", ""));
      const readBcasts = JSON.parse(localStorage.getItem('read_bcasts') || '[]');
      if (!readBcasts.includes(rawId)) {
        localStorage.setItem('read_bcasts', JSON.stringify([...readBcasts, rawId]));
      }
    } 
    // 2. 🟢 Logika BARU untuk Notifikasi "Payment Approved" Lokal
    else if (String(n.id).startsWith("APPROVED_")) {
      const rawId = String(n.id).replace("APPROVED_", "");
      const readApprovals = JSON.parse(localStorage.getItem('read_approvals') || '[]');
      if (!readApprovals.includes(rawId)) {
        localStorage.setItem('read_approvals', JSON.stringify([...readApprovals, rawId]));
      }
    }
    // 3. Jika bukan notif lokal, tembak API read ke server
    else if (typeof n.id === 'number' || (!String(n.id).startsWith("ADMIN_") && !String(n.id).startsWith("BILL_") && !String(n.id).startsWith("PUSH_"))) {
      fetch(`${API_URL}/notifications/${n.id}/read`, {method: 'POST'}).catch(e=>console.error(e));
    }

    // Update UI lokal agar titik merah hilang
    setNotifications(prev => prev.map(item => item.id === n.id ? {...item, is_read: true} : item));
    onNavigate(n.type); 
  };

  return(
    <Modal onClose={onClose}>
      <div style={{padding:"28px 24px 40px"}}>
        <div style={{fontFamily:F.display,fontSize:26,color:T.text,letterSpacing:2,marginBottom:16}}>NOTIFICATIONS</div>
        {notifications.length === 0 ? <Empty icon="🔔" title="ALL CLEAR" sub="No new notifications"/> : 
          notifications.map((n, i) => (
            <div key={n.id} onClick={() => handleItemClick(n)} className="fu" style={{
              background: n.is_read ? T.card : T.cardHi,
              border: `1px solid ${n.is_read ? T.border : accent+"44"}`,
              borderRadius: 16, padding: 14, marginBottom: 10, cursor: "pointer"
            }}>
              <div style={{display:"flex", gap:12}}>
                <div style={{fontSize:22}}>{n.type === 'broadcast' ? '📢' : n.type === 'purchase' ? '🛍️' : n.type === 'support' ? '💬' : '🏋️'}</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700, fontSize:14, color: n.is_read ? T.muted : T.text}}>{n.title}</div>
                  <div style={{fontSize:12, color: T.muted, marginTop:2}}>{n.message}</div>
                </div>
                {!n.is_read && <div style={{width:8, height:8, borderRadius:"50%", background: accent, marginTop:6}}/>}
              </div>
            </div>
          ))
        }
        <button onClick={onClose} style={{width:"100%",padding:13,borderRadius:12,fontFamily:F.display,fontSize:17,background:accent,color:T.bg,fontWeight:700,marginTop:10}}>CLOSE</button>
      </div>
    </Modal>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MEMBER APP
═══════════════════════════════════════════════════════════════ */
function MemberApp({user,updateUser,branches,classes,bookings,setBookings,transfers,setTransfers,products,processPurchase,broadcasts,fitnessProgress,setFitnessProgress,securityLog,addSecurityEvent,supportTickets,setSupportTickets,sendReply,onLogout,badges,notifications,setNotifications, reviews, setReviews, trainers, clientNotes, setSyncQueue, plans}){
  const [tab,setTab]=useState("home");
  const [notifModal, setNotifModal] = useState(false);
  const [step,setStep]=useState(0);
  const [selClass,setSelClass]=useState(null);
  const [selPlan,setSelPlan]=useState(null);
  const [payMethod,setPayMethod]=useState("gopay");
  const [success,setSuccess]=useState(null);
  const [selDate, setSelDate] = useState(DYNAMIC_DAYS[0]);
  const [privateModal, setPrivateModal] = useState(false);
  const [privateData, setPrivateData] = useState(null);
  const [selProduct,setSelProduct]=useState(null);
  const [transferModal,setTransferModal]=useState(false);
  const [progressModal,setProgressModal]=useState(false);
  const [editProfileModal,setEditProfileModal]=useState(false);
  const [achieveModal,setAchieveModal]=useState(false);
  const [historyModal,setHistoryModal]=useState(false);
  const [historyItem,setHistoryItem]=useState(null);
  const [supportModal,setSupportModal]=useState(false);
  const [videoModal,setVideoModal]=useState(null);
  const [reviewBooking, setReviewBooking] = useState(null);

  const accent=T.cyan;
  const myBranch=branches.find(b=>b.id===user.branchId);
  const myClasses=classes.filter(c=>(c.branchId===user.branchId||c.branchId==="ONLINE"));
  const myBookings=bookings.filter(b=>b.userId===user.id);
  
  // 🟢 LOGIKA CERDAS: Filter tiket yang sudah kedaluwarsa & urutkan dari yang paling dekat
  const now = new Date();
  const upcoming = myBookings
    .filter(b => {
      // 1. Abaikan yang belum dibayar atau statusnya bukan upcoming
      if (b.status !== "upcoming" || b.paymentStatus !== "verified") return false;
      
      // 2. Amankan format tanggal MySQL agar tidak 'Invalid Date' di HP
      const safeDateStr = String(b.date).replace(/-/g, "/"); 
      const classDate = new Date(safeDateStr);
      if (isNaN(classDate.getTime())) return true; // Pengaman darurat
      
      // 3. Masukkan komponen jam ke dalam tanggal
      if (b.time) {
        const [h, m] = b.time.split(":");
        classDate.setHours(parseInt(h) || 0, parseInt(m) || 0, 0, 0);
      } else {
        classDate.setHours(23, 59, 59, 999); // Jika jam kosong, anggap berlaku full day
      }

      // 4. HANYA tampilkan jika waktu kelas masih di masa depan
      return classDate > now; 
    })
    .sort((a,b) => {
       // 5. Urutkan agar kelas yang PALING DEKAT muncul di posisi [0] (di Banner Home)
       const timeA = new Date(String(a.date).replace(/-/g, "/"));
       const timeB = new Date(String(b.date).replace(/-/g, "/"));
       if (a.time) { const [h,m] = a.time.split(":"); timeA.setHours(h,m); }
       if (b.time) { const [h,m] = b.time.split(":"); timeB.setHours(h,m); }
       return timeA - timeB;
    });

  const pendingTransfer=transfers.find(t=>t.userId===user.id&&t.status==="pending");

  const handleNotifClick = (type) => {
    setNotifModal(false); // Tutup modal notifikasi dulu
    if(type === 'purchase' || type === 'class') setTab("myclass"); // Lari ke tiket
    if(type === 'support') setSupportModal(true); // Buka popup support
    // Jika broadcast, biarkan di home (sudah default)
  };
  
  const handleBook=(cls)=>{
    // If online class and already paid/has booking, show video player instead
    if(cls.branchId==="ONLINE"&&cls.videoUrl){
      const existing=myBookings.find(b=>b.classId===cls.id&&b.paymentStatus==="verified");
      if(existing){setVideoModal(cls);return;}
    }
    setSelClass(cls);setStep(1);
  };
  const handlePlan=(p)=>{setSelPlan(p);setStep(2);};

  const handleBuyProduct=(product)=>{
    setSelProduct(product);
    setSelPlan({name:product.name,price:product.price,icon:product.icon,badge:"STORE ITEM",color:T.lime,id:"store"});
    setStep(2);
  };  
  
  // 🟢 REVISI FINAL: handlePay dengan ASYNC agar AWAIT bisa berjalan
  const handlePay = async () => {
    const payStat = "pending_verification";
    
    // 1. SKENARIO: BELI PRODUK TOKO
    if (selProduct) {
      const transaction = await processPurchase(selProduct, user.id, payStat, payMethod);
      if (transaction === false) return; 
      setSuccess({
        className: selProduct.name, 
        trainer: "RAW Store", 
        date: transaction.date, 
        time: transaction.time, 
        id: transaction.id, 
        paymentStatus: payStat, 
        type: "purchase", 
        icon: selProduct.icon
      });
      setStep(3); 
      return;
    }

    // Fungsi pembantu untuk antrean offline
    const queueOfflineBooking = (transactionId, payload, localBookingObj) => {
      setBookings(p => [localBookingObj, ...p]);
      setSyncQueue(prev => [...prev, { tempId: transactionId, endpoint: '/member/book-class', data: payload }]);
      setSuccess(localBookingObj);
      setStep(3);
    };

    // 2. SKENARIO: BOOKING PRIVATE SESSION
    if (privateData) {
      const transactionId = "PRV-" + Date.now();
      const payload = {
        transaction_id: transactionId, 
        user_id: user.id, 
        class_name: "Private: " + privateData.trainerName, 
        trainer: privateData.trainerName,
        date: privateData.date, 
        time: privateData.time, 
        payment_status: payStat, 
        amount: privateData.price, 
        method: payMethod, 
        type: "private", 
        branch_id: privateData.branchId, 
        description: "Location: " + privateData.locationText
      };
      
      const nb = {
        id: transactionId, userId: user.id, classId: null, branchId: privateData.branchId, 
        className: "Private: " + privateData.trainerName, trainer: privateData.trainerName, 
        date: privateData.date, time: privateData.time, status: "upcoming", 
        paymentStatus: payStat, amount: privateData.price, method: payMethod, 
        type: "private", icon: "💪", description: "Location: " + privateData.locationText
      };

      if (!navigator.onLine) { 
        queueOfflineBooking(transactionId, payload, nb); 
        setPrivateData(null); 
        return; 
      }

      try {
        const response = await fetch(API_URL + '/member/book-class', { method: 'POST', headers: API_HEADERS, body: JSON.stringify(payload) });
        const data = await response.json();
        if (response.ok && data.status === 'success') { 
          setBookings(p => [nb, ...p]); 
          setSuccess(nb); 
          setStep(3); 
          setPrivateData(null); 
        } else { 
          alert("Gagal booking private: " + data.message); 
        }
      } catch (error) { 
        queueOfflineBooking(transactionId, payload, nb); 
        setPrivateData(null); 
      }
      return;
    }
    
   // 3. SKENARIO: PEMBAYARAN PLAN / BOOKING KELAS
    const transactionId = "TRX-" + Date.now();
    
    // Tentukan type secara konsisten
    const finalType = selClass ? "class" : "membership";

    const payload = {
      transaction_id: transactionId, 
      user_id: user.id, 
      plan_id: selPlan?.id || null, // ID Plan dari tabel plans
      class_id: selClass?.id || null, 
      trainer: selClass?.trainer || "-", 
      date: new Date().toISOString().split('T')[0], // Format YYYY-MM-DD untuk DB
      type: finalType, // Konsisten dengan UI
      payment_status: payStat, 
      amount: selPlan?.price || 0, 
      method: payMethod,
    };
    
    const nb = {
      id: transactionId, 
      userId: user.id, 
      classId: selClass?.id || null, 
      branchId: selClass?.branchId || user.branchId, 
      className: selClass?.name || selPlan?.name || "Membership Plan", 
      trainer: selClass?.trainer || "-", 
      date: selDate.fullDate, // Tetap gunakan format cantik untuk tampilan Tiket
      time: selClass?.time || "08:00", 
      status: "upcoming", 
      paymentStatus: payStat, 
      amount: selPlan?.price || 0, 
      method: payMethod, 
      type: finalType, 
      icon: selClass?.icon || selPlan?.icon || "🎟️",
    };

    if (!navigator.onLine) { 
      queueOfflineBooking(transactionId, payload, nb); 
      return; 
    }

    try {
      const response = await fetch(API_URL + '/member/book-class', { 
        method: 'POST', 
        headers: API_HEADERS, 
        body: JSON.stringify(payload) 
      });
      const data = await response.json();
      if (response.ok && data.status === 'success') { 
        setBookings(p => [nb, ...p]); 
        setSuccess(nb); 
        setStep(3); 
      } else { 
        alert("Gagal melakukan pembayaran: " + data.message); 
      }
    } catch (error) { 
      // Jika request gagal (timeout/server down), amankan ke antrean offline
      queueOfflineBooking(transactionId, payload, nb); 
    }
  };
    
  const reset=()=>{setStep(0);setSelClass(null);setSelPlan(null);setSuccess(null);setSelProduct(null);};

  const requestTransfer = async (toBranchId, reason) => {
    const tid = "TR" + Date.now();
    const dateToday = new Date().toLocaleDateString("en-GB", {day:"numeric", month:"short", year:"numeric"});
    
    try {
      const res = await fetch(API_URL + '/member/transfer-request', {
        method: 'POST',
        headers: API_HEADERS,
        body: JSON.stringify({
          id: tid, user_id: user.id, type: "member", name: user.name,
          from_branch_id: user.branchId, to_branch_id: toBranchId,
          reason: reason, status: "pending", date: dateToday
        })
      });
      
      if (res.ok) {
        setTransfers(p => [{id: tid, userId: user.id, type: "member", name: user.name, fromBranchId: user.branchId, toBranchId, reason, status: "pending", date: dateToday}, ...p]);
        setTransferModal(false);
      }
    } catch {
      alert("Gagal terhubung ke server.");
    }
  };

  const myProgress=fitnessProgress[user.id]||[];
  const addProgress = async (weight, note) => {
    const pid = "PRG" + Date.now();
    const pdate = new Date().toLocaleDateString("en-GB", {day:"numeric", month:"short", year:"numeric"});
    
    try {
      const res = await fetch(API_URL + '/member/progress', {
        method: 'POST',
        headers: API_HEADERS,
        body: JSON.stringify({
          id: pid, user_id: user.id, weight: parseFloat(weight), note: note, date: pdate
        })
      });
      
      if (res.ok) {
        const n = { id: pid, date: pdate, weight: parseFloat(weight), note };
        setFitnessProgress(p => ({...p, [user.id]: [n, ...(p[user.id]||[])]}));
      } else {
        alert("Gagal menyimpan data.");
      }
    } catch {
      alert("Gagal terhubung ke server.");
    }
  };

  const submitSupport = async (subject, message) => {
    const tid = "ST" + Date.now();
    const dateToday = new Date().toLocaleDateString("en-GB", {day:"numeric", month:"short", year:"numeric"});
    
    try {
      const res = await fetch(API_URL + '/member/tickets', {
        method: 'POST',
        headers: API_HEADERS,
        body: JSON.stringify({
          id: tid, user_id: user.id, user_name: user.name,
          subject, message, date: dateToday
        })
      });
      if(res.ok) {
        setSupportTickets(p=>[{ id:tid, userId:user.id, userName:user.name, subject, message, status:"open", date:dateToday, replies:[] }, ...p]);
      }
    } catch(e) { alert("Error connecting to server"); }
  };

  const handleSubmitReview = async ({ rating, comment, booking }) => {
    try {
      const payload = {
        booking_id: booking.id, // Pastikan menggunakan transaction_id dari booking
        user_id: user.id,
        trainer_id: trainers.find(t => t.name === booking.trainer)?.id || "",
        rating: rating,
        comment: comment
      };

      const res = await fetch(API_URL + '/member/review', {
        method: 'POST',
        headers: API_HEADERS,
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (res.ok) {
        // Update state agar rating langsung berubah tanpa perlu refresh
        setReviews(prev => [...prev, data.data]);
        alert("Thank you for your review!");
        // setReviewModal(null); // Tutup modal jika state-nya reviewModal
      } else {
        alert("Gagal mengirim review: " + data.message);
      }
    } catch (e) {
      alert("Gagal terhubung ke server.");
    }
  };

  const handleMemberReply = async (ticketId, message) => {
    await sendReply(ticketId, message, "member");
  };

  const myTickets=supportTickets.filter(t=>t.userId===user.id);
  const pendingPayments=myBookings.filter(b=>b.paymentStatus==="pending_verification").length;

  return(
    <div>
      {step>0&&(
        <Modal onClose={()=>step<3&&reset()}>
          {step===1&&!selProduct&&<PlanPicker cls={selClass} plans={plans} onPick={handlePlan} onBack={reset}/>}
          {step===2&&selPlan&&<PaySheet cls={selClass} plan={selPlan} payMethod={payMethod} setPayMethod={setPayMethod} onPay={handlePay} onBack={()=>selProduct?reset():setStep(1)}/>}
          {step===3&&success&&<SuccessSheet booking={success} onDone={()=>{reset();setTab("myclass");}} onHome={reset} accent={selProduct?T.lime:accent}/>}
        </Modal>
      )}
      {transferModal&&<BranchTransferModal currentBranchId={user.branchId} branches={branches} pendingTransfer={pendingTransfer} onSubmit={requestTransfer} onClose={()=>setTransferModal(false)}/>}
      {privateModal&&<PrivateBookingModal trainers={trainers} branches={branches} classes={classes} bookings={bookings} accent={T.purple} onClose={()=>setPrivateModal(false)} onProceed={(data)=>{
        setPrivateData(data);
        setPrivateModal(false);
        setSelPlan({name:"Private Session", price:data.price, icon:"💪", badge:"1-ON-1", color:T.purple, id:"private"});
        setStep(2); // Langsung ke Payment
      }}/>}
      {progressModal&&<FitnessProgressModal progress={myProgress} onAdd={addProgress} onClose={()=>setProgressModal(false)} accent={accent}/>}
      {editProfileModal&&<SelfEditProfileModal user={user} role="member" updateUser={updateUser} securityLog={securityLog} addSecurityEvent={addSecurityEvent} onClose={()=>setEditProfileModal(false)} accent={accent} plans={plans}/>}
      {achieveModal&&<AchievementsModal user={user} bookings={myBookings} badges={badges} onClose={()=>setAchieveModal(false)} accent={accent}/>}
      {supportModal&&<HelpSupportModal tickets={myTickets} onSubmit={submitSupport} onClose={()=>setSupportModal(false)} accent={accent} sendReply={sendReply}/>}
      {historyModal&&<PurchaseHistoryModal bookings={myBookings} selItem={historyItem} setSelItem={setHistoryItem} classes={classes} products={products} branches={branches} onClose={()=>{setHistoryModal(false);setHistoryItem(null);}} accent={accent}/>}
      {videoModal&&<VideoPlayerModal cls={videoModal} onClose={()=>setVideoModal(null)} accent={T.blue}/>}
      {notifModal&&<NotificationModal notifications={notifications} setNotifications={setNotifications} onClose={()=>setNotifModal(false)} onNavigate={handleNotifClick} accent={accent}/>}
      {reviewBooking && <ReviewModal booking={reviewBooking} onClose={()=>setReviewBooking(null)} onSubmit={(data) => { handleSubmitReview({...data, booking: reviewBooking}); setReviewBooking(null); }} accent={T.yellow} />}

      <div style={{paddingBottom:90}}>
        {tab==="home"&&<MemberHome user={user} myBranch={myBranch} myClasses={myClasses} onBook={handleBook} selDate={selDate} setSelDate={setSelDate} upcoming={upcoming} broadcasts={broadcasts} accent={accent} onTransfer={()=>setTransferModal(true)} pendingTransfer={pendingTransfer} notifications={notifications} onOpenNotif={()=>setNotifModal(true)} myBookings={myBookings} onOpenPrivate={()=>setPrivateModal(true)}/>}
        {tab==="myclass"&&<MemberTickets bookings={myBookings} accent={accent} onDetail={(b)=>{setHistoryItem(b);setHistoryModal(true);}} classes={classes} reviews={reviews} onOpenReview={setReviewBooking}/>}
        {tab==="schedule"&&<MemberSchedule myBranch={myBranch} myClasses={myClasses} selDate={selDate} setSelDate={setSelDate} onBook={handleBook} onOpenPrivate={()=>setPrivateModal(true)}/>}
        {tab==="shop"&&<MemberShop products={products} onBuy={handleBuyProduct} accent={T.lime}/>}
        {tab==="profile"&&<MemberProfile user={user} myBranch={myBranch} bookings={myBookings} progress={myProgress} onLogout={onLogout} onTransfer={()=>setTransferModal(true)} onOpenProgress={()=>setProgressModal(true)} onEditProfile={()=>setEditProfileModal(true)} onOpenAchieve={()=>setAchieveModal(true)} onOpenHistory={()=>setHistoryModal(true)} onOpenSupport={()=>setSupportModal(true)} pendingTransfer={pendingTransfer} accent={accent} badges={badges} clientNotes={clientNotes}/>}
      </div>
      <BNav items={[
        {id:"home",     icon:"🏠",label:"Home"},
        {id:"schedule", icon:"📅",label:"Schedule"},
        {id:"shop",     icon:"🛒",label:"Shop"},
        {id:"myclass",  icon:"🎟️",label:"Tickets",badge:pendingPayments},
        {id:"profile",  icon:"👤",label:"Profile"},
      ]} active={tab} onChange={setTab} accent={accent}/>
    </div>
  );
}

function MemberHome({user,myBranch,myClasses,onBook,selDate,setSelDate,upcoming,broadcasts,accent,onTransfer,pendingTransfer, notifications, onOpenNotif, myBookings, onOpenPrivate}){
  const [cat,setCat]=useState("ALL");
  const [mode,setMode]=useState("offline");
  const cats=["ALL","HIIT","Yoga","Cardio","Boxing","Pilates","Dance","Strength"];
  
  // 🟢 LOGIKA STATISTIK DINAMIS
  const dynClassesCount = (myBookings || []).filter(b => b.type !== "purchase" && b.paymentStatus === "verified" && b.isAttended).length;
  const dynPurchasesCount = (myBookings || []).filter(b => b.type === "purchase" && b.paymentStatus === "verified").length;

  const filtered = myClasses.filter(c => {
    const isOnline = c.branchId === "ONLINE";
    const matchMode = mode === "online" ? isOnline : !isOnline;
    return matchMode && c.day === selDate.dayName && (cat === "ALL" || c.category === cat);
  });

  return(
    <div>
        <div style={{padding:"52px 20px 20px",background:`linear-gradient(160deg,${T.surface},${T.bg})`,position:"relative",overflow:"hidden"}}> 
       
       <div style={{position:"absolute",top:-50,right:-50,width:180,height:180,borderRadius:"50%",background:accent+"18",filter:"blur(60px)"}}/>
        
       <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start"}}>
    <div>
    <RoleBadge role="member"/>
    <div style={{fontFamily:F.body,color:T.muted,fontSize:13,marginTop:10}}>Welcome back,</div>
  </div>

  {/* TOMBOL LONCENG BARU */}
  <div onClick={onOpenNotif} style={{position:"relative", background:T.card, padding:10, borderRadius:12, border:`1px solid ${T.border}`, cursor:"pointer"}}>
    <span style={{fontSize:20}}>🔔</span>
    
    {/* Titik merah hanya muncul jika BUKAN broadcast */}
    {notifications.filter(n => !n.is_read && n.type !== 'broadcast').length > 0 && (
      <div style={{position:"absolute", top:-5, right:-5, background:T.red, color:"#fff", fontSize:9, fontWeight:700, padding:"2px 6px", borderRadius:10}}>
        {notifications.filter(n => !n.is_read && n.type !== 'broadcast').length}
      </div>
    )}
  </div>
</div>

        <div style={{fontFamily:F.display,fontSize:34,color:T.text,letterSpacing:2,lineHeight:1}}>{user.name.toUpperCase()}</div>
        {myBranch&&(
          <div className="rp" onClick={onTransfer} style={{display:"inline-flex",alignItems:"center",gap:6,background:myBranch.color+"18",border:`1px solid ${myBranch.color}44`,borderRadius:20,padding:"4px 12px",marginTop:8,cursor:"pointer"}}>
            <span style={{fontSize:14}}>{myBranch.cover}</span>
            <span style={{fontSize:11,fontWeight:700,color:myBranch.color,fontFamily:F.mono,letterSpacing:1}}>{myBranch.short}</span>
            <span style={{fontSize:10,color:myBranch.color+"88"}}>▼</span>
          </div>
        )}
        {pendingTransfer&&(
          <div style={{background:"#FFD70022",border:"1px solid #FFD70044",borderRadius:12,padding:"8px 12px",marginTop:8,fontSize:12,color:T.yellow}}>
            ⏳ Branch transfer request processing
          </div>
        )}
        <div style={{display:"flex",gap:8,marginTop:10,flexWrap:"wrap"}}>
          <Chip color={accent} text={user.plan.toUpperCase()}/>
          <Chip color={T.red} text={`${getDaysLeft(user)} DAYS LEFT`}/>
        </div>
        
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginTop:16}}>
          {[
            {l:"Classes", v:dynClassesCount, i:"🏆"},
            {l:"Streak", v:`${user.streak||0}d`, i:"🔥"},
            {l:"Calories", v:getCalories(dynClassesCount), i:"⚡"},
            {l:"Purchases", v:dynPurchasesCount, i:"🛒"}
          ].map((s,i)=>(
            <div key={i} style={{background:T.card,borderRadius:14,padding:"12px 10px",border:`1px solid ${T.border}`, display:"flex", alignItems:"center", justifyContent:"space-between"}}>
              <div style={{display:"flex", alignItems:"center", gap:10}}>
                <div style={{fontSize:24}}>{s.i}</div>
                <div>
                  <div style={{fontSize:10,color:T.muted, fontFamily:F.mono, letterSpacing:1}}>{s.l.toUpperCase()}</div>
                  <div style={{fontFamily:F.display,fontSize:22,color:T.text,letterSpacing:1, lineHeight:1}}>{s.v}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {broadcasts.length > 0 && (
        <div style={{padding:"0 20px 10px"}}>
          <div style={{background:T.cardHi, border:`1px solid ${T.orange}`, borderRadius:14, padding:"12px 14px", display:"flex", gap:12, alignItems:"center"}}>
            <div style={{fontSize:24}}>📢</div>
            <div>
              <div style={{fontSize:11, color:T.orange, fontWeight:700, fontFamily:F.mono}}>ANNOUNCEMENT · {broadcasts[0].date}</div>
              <div style={{fontSize:13, color:T.text, marginTop:2}}>{broadcasts[0].text}</div>
            </div>
          </div>
        </div>
      )}

      {upcoming.length>0&&(
        <div style={{padding:"10px 20px 0"}}>
          <div style={{background:`linear-gradient(120deg,${accent}18,${T.card})`,borderRadius:18,padding:"14px 16px",border:`1px solid ${accent}44`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontSize:11,color:accent,fontFamily:F.mono,letterSpacing:2,marginBottom:2}}>NEXT CLASS</div>
              <div style={{fontFamily:F.display,fontSize:20,color:T.text,letterSpacing:1}}>{upcoming[0].className}</div>
              <div style={{fontSize:12,color:T.muted}}>{upcoming[0].date} · {upcoming[0].time}</div>
            </div>
            <div style={{fontSize:34}}>⏰</div>
          </div>
        </div>
      )}
      
      <div style={{padding:"18px 20px 0"}}>
        <SecTitle title="CLASS SCHEDULE" size={20}/>
        <div style={{display:"flex", background:T.card, borderRadius:12, padding:4, marginBottom:16, border:`1px solid ${T.border}`}}>
          <div onClick={()=>setMode("offline")} style={{flex:1, textAlign:"center", padding:"8px", borderRadius:8, background:mode==="offline"?accent:"transparent", color:mode==="offline"?T.bg:T.muted, fontWeight:700, fontSize:12, cursor:"pointer", transition:"all .2s"}}>🏢 IN-STUDIO</div>
          <div onClick={()=>setMode("online")} style={{flex:1, textAlign:"center", padding:"8px", borderRadius:8, background:mode==="online"?T.blue:"transparent", color:mode==="online"?T.bg:T.muted, fontWeight:700, fontSize:12, cursor:"pointer", transition:"all .2s"}}>🌐 VIRTUAL</div>
        </div>
        <DaySel selDate={selDate} setSelDate={setSelDate} accent={mode==="online"?T.blue:(myBranch?.color||accent)} />
      </div>

      <div style={{padding:"10px 20px 0",display:"flex",gap:7,overflowX:"auto",paddingBottom:4}}>
        {cats.map(c=>(
          <div key={c} className="rp" onClick={()=>setCat(c)} style={{padding:"5px 12px",borderRadius:20,fontSize:11,fontWeight:700,whiteSpace:"nowrap",background:cat===c?(mode==="online"?T.blue:(myBranch?.color||accent)):"transparent",color:cat===c?T.bg:T.muted,border:`1px solid ${cat===c?(mode==="online"?T.blue:(myBranch?.color||accent)):T.border}`,cursor:"pointer",transition:"all .2s"}}>{c}</div>
        ))}
      </div>
      <div style={{padding:"10px 20px 0"}}>
        {filtered.length===0?<Empty icon="😴" title="NO CLASSES" sub="Try another category or day"/>
          :filtered.map((cls,i)=><ClassCard key={cls.id} cls={cls} onBook={()=>onBook(cls)} delay={i*.05}/>)}
      </div>
    </div>
  );
}

function MemberSchedule({myBranch,myClasses,selDate,setSelDate,onBook,onOpenPrivate}){
  const accent=myBranch?.color||T.cyan;
  const [mode,setMode]=useState("offline");

  const filtered = myClasses.filter(c => {
    const isOnline = c.branchId === "ONLINE";
    const matchMode = mode === "online" ? isOnline : !isOnline;
    return matchMode && c.day === selDate.dayName;
  });

  return(
    <div style={{padding:"52px 20px 0"}}>
      {myBranch&&(
        <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:14}}>
          <span style={{fontSize:20}}>{myBranch.cover}</span>
          <span style={{fontFamily:F.display,fontSize:14,color:myBranch.color,letterSpacing:1}}>{myBranch.name}</span>
        </div>
      )}
      <SecTitle title="CLASS SCHEDULE" size={30}/>

      <div style={{padding:"16px 20px 0"}}>
        <div className="rp" onClick={onOpenPrivate} style={{background:`linear-gradient(120deg, ${T.purple}22, ${T.card})`, borderRadius:16, padding:"16px", border:`1px solid ${T.purple}44`, display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer"}}>
          <div>
            <div style={{fontSize:11, color:T.purple, fontFamily:F.mono, letterSpacing:2, marginBottom:4}}>1-ON-1 COACHING</div>
            <div style={{fontFamily:F.display, fontSize:22, color:T.text, letterSpacing:1}}>BOOK PRIVATE SESSION</div>
            <div style={{fontSize:12, color:T.muted, marginTop:2}}>Custom location or in-studio</div>
          </div>
          <div style={{fontSize:34}}>🥊</div>
        </div>
      </div>

      <div style={{display:"flex", background:T.card, borderRadius:12, padding:4, marginBottom:16, border:`1px solid ${T.border}`}}>
        <div onClick={()=>setMode("offline")} style={{flex:1, textAlign:"center", padding:"8px", borderRadius:8, background:mode==="offline"?accent:"transparent", color:mode==="offline"?T.bg:T.muted, fontWeight:700, fontSize:12, cursor:"pointer", transition:"all .2s"}}>🏢 IN-STUDIO</div>
        <div onClick={()=>setMode("online")} style={{flex:1, textAlign:"center", padding:"8px", borderRadius:8, background:mode==="online"?T.blue:"transparent", color:mode==="online"?T.bg:T.muted, fontWeight:700, fontSize:12, cursor:"pointer", transition:"all .2s"}}>🌐 VIRTUAL</div>
      </div>

      <DaySel selDate={selDate} setSelDate={setSelDate} accent={mode==="online"?T.blue:accent}/>
      <div style={{marginTop:12}}>
        {filtered.length===0?<Empty icon="😴" title="NO CLASSES" sub="Try another day"/>
          :filtered.map((cls,i)=><ClassCard key={cls.id} cls={cls} onBook={()=>onBook(cls)} delay={i*.05}/>)}
      </div>
    </div>
  );
}

function MemberShop({products,onBuy,accent}){
  const cats=["All","Merchandise","Supplements","Equipment","Events","F&B"];
  const [selCat,setSelCat]=useState("All");
  const [search,setSearch]=useState(""); // STATE PENCARIAN BARU
  const [selProduct,setSelProduct]=useState(null);
  const [activeImg,setActiveImg]=useState(0);
  
  const availableProducts = products.filter(p => p.stock > 0);
  
  // Filter by Category AND Search
  const filtered = availableProducts.filter(p => {
    const matchCat = selCat === "All" || p.category === selCat;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });
  
  if(selProduct) return(
    <div style={{padding:"52px 20px 0"}}>
     <div onClick={()=>setSelProduct(null)} style={{display:"flex",alignItems:"center",gap:8,color:T.muted,fontSize:13,cursor:"pointer",marginBottom:16,fontWeight:600}}>← Back to Store</div>
      <div style={{background:T.card,borderRadius:20,border:`1px solid ${T.border}`,overflow:"hidden",marginBottom:16}}>
        <div style={{height:selProduct.images?.length>0?260:160, background:selProduct.images?.length>0?`url(${selProduct.images[activeImg]})`:`linear-gradient(135deg,${accent}22,${T.cardHi})`, backgroundSize:"cover", backgroundPosition:"center", display:"flex", alignItems:"center", justifyContent:"center", fontSize:80}}>
          {!(selProduct.images?.length>0) && selProduct.icon}
        </div>
        {selProduct.images?.length > 1 && (
          <div style={{display:"flex", gap:10, padding:"14px 20px 0", overflowX:"auto"}}>
            {selProduct.images.map((img, idx) => (
              <div key={idx} onClick={()=>setActiveImg(idx)} style={{width:50, height:50, flexShrink:0, borderRadius:8, backgroundImage:`url(${img})`, backgroundSize:"cover", backgroundPosition:"center", border:`2px solid ${activeImg===idx?accent:"transparent"}`, cursor:"pointer", opacity:activeImg===idx?1:0.6, transition:"all .2s"}}/>
            ))}
          </div>
        )}
        <div style={{padding:"20px"}}>
          <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:8,marginBottom:8}}>
            <div style={{fontFamily:F.display,fontSize:24,color:T.text,letterSpacing:1,lineHeight:1.1,flex:1}}>{selProduct.name}</div>
            <Chip color={accent} text={selProduct.category}/>
          </div>
          <div style={{fontFamily:F.display,fontSize:30,color:accent,letterSpacing:1,marginBottom:4}}>Rp {selProduct.price.toLocaleString("id")}</div>
          <div style={{fontSize:12,color:selProduct.stock<5?T.red:T.muted,marginBottom:16}}>Stock: {selProduct.stock} units{selProduct.stock===0?" — SOLD OUT":selProduct.stock<5?" — LOW STOCK":""}</div>
          <div style={{fontSize:14,color:T.muted,lineHeight:1.7,marginBottom:20}}>{selProduct.description}</div>
          <button onClick={()=>{if(selProduct.stock>0)onBuy(selProduct);}} disabled={selProduct.stock<=0} style={{width:"100%",padding:16,background:selProduct.stock>0?accent:T.border,color:selProduct.stock>0?T.bg:T.dim,borderRadius:14,fontFamily:F.display,fontSize:20,letterSpacing:2,fontWeight:700,border:"none",cursor:selProduct.stock>0?"pointer":"default"}}>
            {selProduct.stock>0?"BUY NOW":"SOLD OUT"}
          </button>
        </div>
      </div>
    </div>
  );

  return(
    <div style={{padding:"52px 20px 0"}}>
      <SecTitle title="GYM STORE" size={30}/>
      
      {/* INPUT PENCARIAN BARU */}
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search products..." style={{width:"100%",background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"11px 16px",color:T.text,fontSize:13,marginBottom:14}}/>
      
      <div style={{display:"flex",gap:7,overflowX:"auto",paddingBottom:8,marginBottom:14}}>
        {cats.map(c=>(
          <div key={c} className="rp" onClick={()=>setSelCat(c)} style={{padding:"6px 14px",borderRadius:20,fontSize:11,fontWeight:700,whiteSpace:"nowrap",background:selCat===c?accent:"transparent",color:selCat===c?T.bg:T.muted,border:`1px solid ${selCat===c?accent:T.border}`,cursor:"pointer",transition:"all .2s",letterSpacing:.5}}>{c}</div>
        ))}
      </div>
      
      {filtered.length===0?<Empty icon="🛍️" title="NOT FOUND" sub="Try different keywords or category"/>:(
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          {filtered.map((p,i)=>(
            <div key={p.id} className="fu rp" onClick={()=>{setSelProduct(p);setActiveImg(0);}} style={{animationDelay:`${i*.04}s`,background:T.card,borderRadius:16,border:`1px solid ${T.border}`,overflow:"hidden",cursor:"pointer",position:"relative"}}>
              {p.stock===0&&<div style={{position:"absolute",top:8,right:8,background:"#FF313188",color:"#fff",fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:20,fontFamily:F.mono}}>SOLD OUT</div>}
              {p.stock>0&&p.stock<5&&<div style={{position:"absolute",top:8,right:8,background:T.yellow+"BB",color:T.bg,fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:20,fontFamily:F.mono}}>LOW STOCK</div>}
              <div style={{height:110,background:p.images?.length>0?`url(${p.images[0]})`:`linear-gradient(135deg,${accent}18,${T.cardHi})`,backgroundSize:"cover",backgroundPosition:"center",display:"flex",alignItems:"center",justifyContent:"center",fontSize:44, borderBottom:`1px solid ${T.border}`}}>
                {!(p.images?.length>0) && p.icon}
              </div>
              <div style={{padding:"12px 12px 14px"}}>
                <div style={{fontWeight:700,fontSize:13,color:T.text,lineHeight:1.3,marginBottom:4,minHeight:36}}>{p.name}</div>
                <div style={{color:accent,fontFamily:F.display,fontSize:18,letterSpacing:.5}}>Rp {(p.price/1000).toFixed(0)}K</div>
                <div style={{fontSize:10,color:T.muted,marginTop:2,marginBottom:10}}>Stock: {p.stock}</div>
                <button onClick={e=>{e.stopPropagation();if(p.stock>0)onBuy(p);}} disabled={p.stock<=0} style={{width:"100%",padding:"8px 0",background:p.stock>0?accent:T.border,color:p.stock>0?T.bg:T.dim,borderRadius:10,fontWeight:700,fontSize:12,border:"none",cursor:p.stock>0?"pointer":"default",letterSpacing:.5}}>
                  {p.stock>0?"BUY NOW":"SOLD OUT"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div style={{height:20}}/>
    </div>
  );
}

function MemberTickets({bookings,accent,onDetail,classes,reviews,onOpenReview}){
  const [filter,setFilter]=useState("all"); 
  const [search,setSearch]=useState(""); 
  
  const sorted=[...bookings].sort((a,b)=>new Date(b.date)-new Date(a.date));
  
  // PERBAIKAN 1: Semua kata "purchase" diganti "product" agar akur dengan Laravel
  const filtered = sorted.filter(b => {
    const matchType = filter === "all" ? true : filter === "class" ? b.type !== "product" : b.type === "product";
    const matchSearch = b.className.toLowerCase().includes(search.toLowerCase()) || b.id.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  const upcoming=bookings.filter(b=>b.status==="upcoming"&&b.paymentStatus==="verified");
  const purchases=bookings.filter(b=>b.type==="product"); // 👈 Diperbaiki

  return(
    <div style={{padding:"52px 20px 0"}}>
      <SecTitle title="MY PURCHASES" size={28}/>
      <div style={{display:"flex",gap:10,marginBottom:16}}>
        <StatBlock label="Active Tickets" val={upcoming.length} color={accent}/>
        <StatBlock label="Store Orders" val={purchases.length} color={T.lime}/>
        <StatBlock label="Total" val={bookings.length} color={T.muted}/>
      </div>
      
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search transaction ID or item..." style={{width:"100%",background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"11px 16px",color:T.text,fontSize:13,marginBottom:14}}/>

      <div style={{display:"flex",gap:7,marginBottom:14}}>
        {/* PERBAIKAN 2: Value tab Shop diubah jadi 'product' */}
        {[{v:"all",l:"All"},{v:"class",l:"🎟️ Classes"},{v:"product",l:"🛒 Shop"}].map(f=>(
          <div key={f.v} className="rp" onClick={()=>setFilter(f.v)} style={{flex:1,padding:"8px",borderRadius:12,fontSize:11,fontWeight:700,textAlign:"center",background:filter===f.v?accent:"transparent",color:filter===f.v?T.bg:T.muted,border:`1px solid ${filter===f.v?accent:T.border}`,cursor:"pointer",transition:"all .2s"}}>{f.l}</div>
        ))}
      </div>

      {filtered.length===0?<Empty icon="🎟️" title="NO ITEMS FOUND" sub="Make sure spelling is correct"/>:
        filtered.map((b,i)=>{
          const classDate = new Date(b.date);
          const diffDays = (new Date() - classDate) / (1000 * 60 * 60 * 24);
          const canReview = b.type === "class" && b.paymentStatus === "verified" && diffDays >= 1 && diffDays <= 3 && !reviews?.find(r => r.booking_id === b.id);

          return(
          <div key={b.id} className="fu rp" onClick={()=>onDetail&&onDetail(b)}
            style={{animationDelay:`${i*.04}s`,background:T.card,borderRadius:16,padding:14,marginBottom:10,
            border:`1px solid ${b.type==="product"?T.lime+"44":b.status==="upcoming"?accent+"44":T.border}`,
            cursor:"pointer",position:"relative",overflow:"hidden"}}>
            
            {(b.type==="product"||b.status==="upcoming")&&<div style={{position:"absolute",top:0,left:0,right:0,height:2,background:b.type==="product"?T.lime:accent}}/>}
            
            <div style={{display:"flex",gap:12,alignItems:"center"}}>
              <div style={{width:48,height:48,borderRadius:14,background:b.type==="product"?T.lime+"22":accent+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>
                
                {/* PERBAIKAN 3: Diberi tanda kurung agar ikon tidak redundant/kembar semua! */}
                {b.icon || (b.type === "product" ? "🛒" : "🎟️")}

              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontFamily:F.display,fontSize:17,color:T.text,letterSpacing:1,lineHeight:1.1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{b.className}</div>
                <div style={{fontSize:11,color:T.muted,marginTop:2}}>{b.date}{b.time?` · ${b.time}`:""}</div>
                <div style={{fontSize:11,color:T.muted,marginTop:1}}>Rp {(b.amount||0).toLocaleString("id")} · {b.method||"—"}</div>
              </div>
              <div style={{textAlign:"right",flexShrink:0}}>
                <div style={{padding:"3px 8px",borderRadius:20,fontSize:9,fontWeight:700,fontFamily:F.mono,
                  background:b.paymentStatus==="verified"?T.green+"22":b.paymentStatus==="pending_verification"?T.yellow+"22":T.border,
                  color:b.paymentStatus==="verified"?T.green:b.paymentStatus==="pending_verification"?T.yellow:T.muted,
                  border:`1px solid ${b.paymentStatus==="verified"?T.green+"44":b.paymentStatus==="pending_verification"?T.yellow+"44":T.border}`
                }}>
                  {b.paymentStatus==="verified"?"PAID":b.paymentStatus==="pending_verification"?"PENDING":"—"}
                </div>
                <div style={{fontSize:10,color:T.dim,marginTop:4,fontFamily:F.mono}}>›</div>
              </div>
            </div>
            {canReview && (
              <button onClick={(e) => { e.stopPropagation(); onOpenReview(b); }} style={{marginTop:10, width:"100%", padding:"8px", borderRadius:10, background:T.yellow, color:T.bg, fontWeight:700, fontSize:11, border:"none", cursor:"pointer"}}>
                ⭐ RATE COACH (Limit H+3)
              </button>
            )}
          </div>
        )})}
      <div style={{height:8}}/>
    </div>
  );
}

function MemberProfile({user,myBranch,bookings,progress,onLogout,onTransfer,onOpenProgress,onEditProfile,onOpenAchieve,onOpenHistory,onOpenSupport,pendingTransfer,accent,badges,clientNotes}){
  // 🟢 Ambil catatan milik member ini (Menggunakan ID asli misal: "1" atau "2")
  const myNotes = (clientNotes || []).filter(n => String(n.user_id) === String(user.id.replace("U", "")));
  
  // --- 1. LOGIKA DINAMIS EVALUASI BADGE UNTUK SUMMARY ---
  const classBookings = (bookings || []).filter(b => b.type !== "purchase" && b.paymentStatus === "verified");
  const purchaseCount = (bookings || []).filter(b => b.type === "purchase" && b.paymentStatus === "verified").length;
  const uniqueBranches = new Set(classBookings.map(b => b.branchId)).size;

  const evaluateBadge = (b) => {
    switch(b.ruleType) {
      case "class_count": return classBookings.length >= b.targetValue;
      case "streak": return (user.streak || 0) >= b.targetValue;
      case "months": return getMonthsActive(user.joinDate) >= b.targetValue;
      case "purchase_count": return purchaseCount >= b.targetValue;
      case "branch_count": return uniqueBranches >= b.targetValue;
      default: return false;
    }
  };

  // Hitung jumlah badge yang terpenuhi dari database
  const earnedCount = (badges || []).filter(evaluateBadge).length;
  const totalBadges = (badges || []).length;

  return(
    <div style={{padding:"52px 20px 0"}}>
      {/* Header Profile */}
      <div style={{background:`linear-gradient(140deg,${T.card},${T.surface})`,borderRadius:20,padding:20,marginBottom:16,border:`1px solid ${T.border}`,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-20,right:-20,width:100,height:100,borderRadius:"50%",background:accent+"18",filter:"blur(30px)"}}/>
        <div style={{display:"flex",gap:14,alignItems:"center"}}>
          <div style={{width:68,height:68,borderRadius:18,background:`linear-gradient(135deg,${accent},#0099BB)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:30,border:`2px solid ${accent}44`,flexShrink:0}}>{user.avatar}</div>
         <div style={{minWidth:0}}>
            <div style={{fontFamily:F.display,fontSize:22,color:T.text,letterSpacing:2,lineHeight:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user.name.toUpperCase()}</div>
            <div style={{fontSize:12,color:T.muted,marginTop:3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user.email}</div>
            <div style={{fontSize:10,color:accent,marginTop:4,fontFamily:F.mono}}>MEMBER SINCE: {user.joinDate?.toUpperCase() || "NEW"}</div>
            {getLastPaymentDate(user) && (
              <div style={{fontSize:10,color:T.muted,marginTop:2,fontFamily:F.mono}}>
                LAST PAYMENT: {getLastPaymentDate(user).toLocaleDateString("en-GB", {day:"numeric", month:"short", year:"numeric"}).toUpperCase()}
              </div>
            )}
            <div style={{marginTop:6}}><Chip color={accent} text={user.plan?.toUpperCase()||"MEMBER"}/></div></div>
        </div>
        
        {/* Stats Row */}
        <div style={{display:"flex",marginTop:16,background:T.bg+"88",borderRadius:12,overflow:"hidden"}}>
          {[{l:"Classes",v:user.totalClasses||0},{l:"Months",v:getMonthsActive(user.joinDate)},{l:"Points",v:getPoints(user)}].map((s,i)=>(
            <div key={i} style={{flex:1,padding:"10px 0",textAlign:"center",borderRight:i<2?`1px solid ${T.border}`:"none"}}>
              <div style={{fontFamily:F.display,fontSize:20,color:accent,letterSpacing:1}}>{s.v}</div>
              <div style={{fontSize:11,color:T.muted}}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* My Branch Info */}
      {myBranch&&(
        <div className="rp" onClick={onTransfer} style={{background:`linear-gradient(120deg,${myBranch.color}18,${T.card})`,borderRadius:16,padding:"14px 16px",marginBottom:16,border:`1px solid ${myBranch.color}44`,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{minWidth:0}}>
            <div style={{fontSize:11,color:myBranch.color,fontFamily:F.mono,letterSpacing:2,marginBottom:2}}>MY BRANCH</div>
            <div style={{fontFamily:F.display,fontSize:18,color:T.text,letterSpacing:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{myBranch.cover} {myBranch.name}</div>
            <div style={{fontSize:12,color:T.muted,marginTop:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{myBranch.address}</div>
            {pendingTransfer&&<div style={{fontSize:11,color:T.yellow,marginTop:4}}>⏳ Transfer request pending</div>}
          </div>
          <div style={{fontSize:12,color:myBranch.color,fontWeight:700,flexShrink:0,marginLeft:8}}>Move →</div>
        </div>
      )}

      {/* Menu Actions */}
      <div onClick={onEditProfile}><MenuIt icon="✏️" label="Edit Profile" sub="Name, phone, address, DOB"/></div>
      <div onClick={onOpenProgress}><MenuIt icon="📊" label="Fitness Progress" sub={`${progress.length} records`}/></div>
      <div onClick={onOpenHistory}><MenuIt icon="💳" label="Purchase History" sub={`${bookings.length} transactions`}/></div>
      
      {/* ── PERBAIKAN: SUMMARY ACHIEVEMENTS DINAMIS ── */}
      <div onClick={onOpenAchieve}>
        <MenuIt 
          icon="🏆" 
          label="Achievements" 
          sub={`${earnedCount} of ${totalBadges} badges earned`} 
        />
      </div>
      
      <div onClick={onOpenSupport}><MenuIt icon="❓" label="Help & Support" sub="Contact our team"/></div>

      <SecTitle title="COACH NOTES"/>
      {myNotes.length === 0 ? (
        <div style={{background:T.card,borderRadius:14,padding:16,border:`1px solid ${T.border}`,textAlign:"center",color:T.dim,fontSize:12,marginBottom:16}}>No notes from your coaches yet. Keep training!</div>
      ) : (
        <div style={{background:T.card,borderRadius:14,padding:16,border:`1px solid ${T.border}`,marginBottom:16}}>
          {myNotes.map((n, i) => (
            <div key={i} style={{marginBottom: i !== myNotes.length - 1 ? 12 : 0, paddingBottom: i !== myNotes.length - 1 ? 12 : 0, borderBottom: i !== myNotes.length - 1 ? `1px dashed ${T.border}` : "none"}}>
              <div style={{fontSize:10, color:accent, fontFamily:F.mono, marginBottom:4}}>📝 {n.date}</div>
              <div style={{fontSize:13, color:T.muted, lineHeight:1.4}}>"{n.note}"</div>
            </div>
          ))}
        </div>
      )}
      
      <div className="rp" onClick={onLogout} style={{background:"#FF313118",borderRadius:14,padding:"14px 16px",marginTop:8,border:"1px solid #FF313133",display:"flex",alignItems:"center",gap:14,cursor:"pointer"}}>
        <div style={{width:40,height:40,borderRadius:12,background:"#FF313133",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>🚪</div>
        <div style={{fontWeight:700,color:T.red,fontSize:14}}>Logout</div>
      </div>
      <div style={{height:20}}/>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ADMIN APP
═══════════════════════════════════════════════════════════════ */
function AdminApp({user,users,setUsers,updateUser,trainers,setTrainers,updateTrainer,updateTrainerStatus,branches,setBranches,classes,setClasses,bookings,setBookings,transfers,setTransfers,products,setProducts,sales,trainerLogs,broadcasts,setBroadcasts,gymSettings,setGymSettings,badges,setBadges,securityLog,addSecurityEvent,supportTickets,setSupportTickets,sendReply,setSyncQueue,onLogout,getTrainerStats,notifications,setNotifications, plans, setPlans}){
  const [tab,setTab]=useState("dashboard");

  // 🟢 LOGIKA SUPER ADMIN VS BRANCH ADMIN
  const isSuperAdmin = user.role === "admin" && !user.branchId;
  const adminBranchId = isSuperAdmin ? "ALL" : user.branchId;
  const [selBranchFilter,setSelBranchFilter]=useState(adminBranchId);

  // Paksa filter terkunci jika bukan Super Admin
  useEffect(() => {
    if (!isSuperAdmin) setSelBranchFilter(user.branchId);
  }, [user.branchId, isSuperAdmin]);

  const [addClassModal,setAddClassModal]=useState(false);
  const [addMemberModal,setAddMemberModal]=useState(false);
  const [transferAction,setTransferAction]=useState(null);
  const [broadcastModal,setBroadcastModal]=useState(false);
  const [badgesModal,setBadgesModal]=useState(false);
  const [gymSettingsModal,setGymSettingsModal]=useState(false);
  const [planSettingsModal,setPlanSettingsModal]=useState(false);
  const [reportsModal,setReportsModal]=useState(false);
  const [securityModal,setSecurityModal]=useState(false);
  const [editUserModal,setEditUserModal]=useState(null);
  const [supportInboxModal,setSupportInboxModal]=useState(false);
  const [editClassModal,setEditClassModal]=useState(null); // class to edit
  const [notifModal,setNotifModal]=useState(false);
  const accent = isSuperAdmin ? T.orange : (branches.find(b=>b.id===user.branchId)?.color || T.orange);

  const members=users.filter(u=>u.role==="member");
  const pendingTransfers=transfers.filter(t=>t.status==="pending");
  const openTickets=supportTickets.filter(t=>t.status==="open").length;

  const handleNotifClick = (type) => {
    setNotifModal(false);
    if (type === 'purchase') setTab("finance"); // Lari ke tab Finance (Verify Payment)
  };

  const handleAdminAddMember = async (m) => {
    try {
      const res = await fetch(API_URL + '/register', {
        method: 'POST',
        headers: API_HEADERS,
        body: JSON.stringify({
          name: m.name,
          email: m.email,
          password: '123', // Password default untuk member yang dibuatkan Admin
          branch_id: m.branchId
        })
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        // Masukkan ke state dengan ID dari database
        setUsers(p=>[{...m, id: "U"+data.user.id, role:"member", pass:"123", streak:0, totalClasses:0, spend:0}, ...p]);
        setAddMemberModal(false);
      } else {
        alert("Gagal: " + (data.message || "Email mungkin sudah digunakan."));
      }
    } catch (error) {
      console.error(error);
      alert("Tidak dapat terhubung ke server database.");
    }
  };

  const processTransferApi = async (tr, action) => {
    try {
      const res = await fetch(API_URL + '/admin/transfer-action/' + tr.id, {
        method: 'POST',
        headers: API_HEADERS,
        body: JSON.stringify({ action })
      });
      
      if (res.ok) {
        setTransfers(prev => prev.map(t => t.id === tr.id ? {...t, status: action} : t));
        if (action === 'approved') {
          setUsers(prev => prev.map(u => u.id === tr.userId ? {...u, branchId: tr.toBranchId} : u));
        }
        setTransferAction(null);
      }
    } catch {
      alert("Gagal memproses transfer.");
    }
  };

  const approveTransfer = (tr) => processTransferApi(tr, 'approved');
  const rejectTransfer  = (tr) => processTransferApi(tr, 'rejected');
  
  const moveTrainer=(trainerId,newBranchId)=>{
    setTrainers(prev=>prev.map(t=>t.id===trainerId?{...t,branchId:newBranchId}:t));
    setUsers(prev=>prev.map(u=>u.trainerId===trainerId?{...u,branchId:newBranchId}:u));
  };

  const handleBroadcast = async (text) => {
    const bDate = new Date().toLocaleDateString("en-GB", {day:"numeric", month:"short", year:"numeric"});
    try {
      const res = await fetch(API_URL + '/admin/broadcasts', {
        method: 'POST',
        headers: API_HEADERS,
        body: JSON.stringify({ text, date: bDate })
      });
      if (res.ok) {
        const data = await res.json();
        // Gunakan data dari database, atau fallback lokal jika format berbeda
        setBroadcasts(p => [data.data || { id: Date.now(), text, date: bDate }, ...p]);
      } else {
        setBroadcasts(p => [{ id: Date.now(), text, date: bDate }, ...p]); // Fallback lokal
      }
    } catch(e) {
      setBroadcasts(p => [{ id: Date.now(), text, date: bDate }, ...p]); // Fallback lokal
    }
  };

  const handleAdminReply = async (ticketId, message) => {
    await sendReply(ticketId, message, "admin");
  };

  const closeTicket = async (id) => {
    try {
      const res = await fetch(API_URL + '/admin/tickets/' + id + '/close', { method: 'POST', headers: API_HEADERS });
      if(res.ok) setSupportTickets(prev=>prev.map(t=>t.id===id?{...t,status:"closed"}:t));
    } catch(e) { console.error(e); }
  };

  const handleAddClass = async (c) => {
    const newId = "C" + Date.now();
    try {
      const res = await fetch(API_URL + '/admin/classes', {
        method: 'POST',
        headers: API_HEADERS,
        body: JSON.stringify({...c, id: newId, slots: c.total, status: "active"})
      });
      if(res.ok) {
        const data = await res.json();
        // Konversi penamaan field kembali ke format React
        const newClass = {...c, id: newId, slots: c.total, status: "active", branchId: data.data.branch_id, trainerId: data.data.trainer_id};
        setClasses(p => [newClass, ...p]);
        setAddClassModal(false);
      }
    } catch(e) { alert("Gagal terhubung ke server."); }
  };

  const handleEditClass = async (updated) => {
    try {
      const res = await fetch(API_URL + '/admin/classes/' + updated.id, {
        method: 'PUT',
        headers: API_HEADERS,
        body: JSON.stringify(updated)
      });
      if(res.ok) {
        setClasses(p => p.map(c => c.id === updated.id ? updated : c));
        setEditClassModal(null);
      }
    } catch(e) { alert("Gagal terhubung ke server."); }
  };

  // Menu Navigasi Bawah Dinamis
  const navItems = [
    {id:"dashboard",icon:"📊",label:"Dash"},
    {id:"members",  icon:"👥",label:"Members"},
    {id:"trainers", icon:"🏋️",label:"Trainers"},
    {id:"classes",  icon:"📅",label:"Classes"},
    {id:"finance",  icon:"💳",label:"Finance",badge:bookings.filter(b=>b.paymentStatus==="pending_verification" && (isSuperAdmin || b.branchId === user.branchId)).length},
  ];
  
  // Tambah tab Branches khusus Super Admin
  if (isSuperAdmin) {
    navItems.push({id:"branches", icon:"🏢",label:"Branches"});
  }
  navItems.push({id:"profile", icon:"🛡️",label:isSuperAdmin?"S.Admin":"Admin",badge:openTickets});

  return(
    <div>
      {notifModal&&<NotificationModal notifications={notifications} setNotifications={setNotifications} onClose={()=>setNotifModal(false)} onNavigate={handleNotifClick} accent={accent}/>}
      {addClassModal&&<AddClassModal branches={branches} trainers={trainers} onClose={()=>setAddClassModal(false)} onAdd={handleAddClass} accent={accent}/>}
      {editClassModal&&<EditClassModal cls={editClassModal} branches={branches} trainers={trainers} onClose={()=>setEditClassModal(null)} onSave={handleEditClass} accent={accent}/>}
      {addMemberModal&&<AddMemberModal branches={branches} onClose={()=>setAddMemberModal(false)} onAdd={handleAdminAddMember} accent={accent} plans={plans}/>}
      {transferAction&&<TransferActionModal tr={transferAction} branches={branches} onApprove={approveTransfer} onReject={rejectTransfer} onClose={()=>setTransferAction(null)}/>}
      {broadcastModal&&<BroadcastModal broadcasts={broadcasts} onClose={()=>setBroadcastModal(false)} onSend={handleBroadcast} accent={accent}/>}
      {badgesModal&&<AdminBadgesModal badges={badges} setBadges={setBadges} onClose={()=>setBadgesModal(false)} accent={accent}/>}
      {gymSettingsModal&&<GymSettingsModal branches={branches} gymSettings={gymSettings} setGymSettings={setGymSettings} onClose={()=>setGymSettingsModal(false)} accent={accent}/>}
      {planSettingsModal&&<PlanSettingsModal plans={plans} setPlans={setPlans} onClose={()=>setPlanSettingsModal(false)} accent={accent} setSyncQueue={setSyncQueue}/>}
      {reportsModal&&<FullReportsModal branches={branches} members={members} classes={classes} bookings={bookings} sales={sales} trainers={trainers} onClose={()=>setReportsModal(false)} accent={accent}/>}
      {securityModal&&<SecurityModal user={user} securityLog={securityLog} addSecurityEvent={addSecurityEvent} updateUser={updateUser} onClose={()=>setSecurityModal(false)} accent={accent}/>}
      {editUserModal&&<EditProfileModal target={editUserModal.target} role={editUserModal.role} branches={branches} trainers={trainers} users={users} updateUser={updateUser} updateTrainer={updateTrainer} onClose={()=>setEditUserModal(null)} accent={accent} plans={plans}/>}
      {supportInboxModal&&<AdminSupportInbox 
        tickets={supportTickets} 
        users={users} 
        onReply={(id, text) => sendReply(id, text, "admin")} // Pastikan menggunakan sendReply yang ditangkap di atas
        onClose={()=>setSupportInboxModal(false)} 
        onCloseTicket={closeTicket} 
        accent={accent}
      />}
      <div style={{paddingBottom:90}}>
        {tab==="dashboard"&&<AdminDash members={members} branches={branches} classes={classes} bookings={bookings} pendingTransfers={pendingTransfers} selBranch={selBranchFilter} setSelBranch={setSelBranchFilter} accent={accent} openTickets={openTickets} onOpenSupport={()=>setSupportInboxModal(true)} notifications={notifications} onOpenNotif={()=>setNotifModal(true)} isSuperAdmin={isSuperAdmin}/>}
        {tab==="members"  &&<AdminMembers members={members} setUsers={setUsers} branches={branches} onAdd={()=>setAddMemberModal(true)} accent={accent} onTransferAction={setTransferAction} transfers={transfers} onEditUser={(m)=>setEditUserModal({target:m,role:"member"})} selBranch={selBranchFilter} setSelBranch={setSelBranchFilter} isSuperAdmin={isSuperAdmin}/>}
        {tab==="trainers" &&<AdminTrainers trainers={trainers} branches={branches} classes={classes} logs={trainerLogs} onMove={moveTrainer} updateTrainerStatus={updateTrainerStatus} accent={accent} onEditTrainer={(t)=>setEditUserModal({target:t,role:"trainer"} )} getTrainerStats={getTrainerStats}/>}
        {tab==="classes"  &&<AdminClasses classes={classes} setClasses={setClasses} branches={branches} trainers={trainers} onAdd={()=>setAddClassModal(true)} onEdit={setEditClassModal} accent={accent}/>}
        {tab==="finance"  &&<AdminFinance products={products} setProducts={setProducts} sales={sales} bookings={bookings} setBookings={setBookings} setSyncQueue={setSyncQueue} accent={T.green}/>}
        {tab==="profile"  &&<AdminProfile user={user} onLogout={onLogout} pendingTransfers={pendingTransfers} onTransferAction={setTransferAction} onOpenBroadcast={()=>setBroadcastModal(true)} onOpenBadges={()=>setBadgesModal(true)} onOpenGymSettings={()=>setGymSettingsModal(true)} onOpenPlanSettings={()=>setPlanSettingsModal(true)} onOpenReports={()=>setReportsModal(true)} onOpenSecurity={()=>setSecurityModal(true)} onOpenSupport={()=>setSupportInboxModal(true)} openTickets={openTickets} accent={accent} badges={badges} branches={branches}/>}
        {tab==="branches" && isSuperAdmin && <AdminBranches branches={branches} setBranches={setBranches} accent={accent} setSyncQueue={setSyncQueue} />}
      </div>
      <BNav items={navItems} active={tab} onChange={setTab} accent={accent}/>
    </div>
  );
}

function AdminDash({members,branches,classes,bookings,pendingTransfers,selBranch,setSelBranch,accent,openTickets,onOpenSupport,notifications,onOpenNotif,isSuperAdmin}){
  const filtMembers=selBranch==="ALL"?members:members.filter(m=>m.branchId===selBranch);
  const filtClasses=selBranch==="ALL"?classes:classes.filter(c=>c.branchId===selBranch);
  
  // 🟢 GRAFIK REVENUE DINAMIS 6 BULAN TERAKHIR (Termasuk Subscriptions)
  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const now = new Date();
  const last6Months = Array.from({length: 6}, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    return { m: monthNames[d.getMonth()], y: d.getFullYear(), v: 0 };
  });

  const verifiedBookings = bookings.filter(b => b.paymentStatus === "verified" && (selBranch === "ALL" || b.branchId === selBranch));
  verifiedBookings.forEach(b => {
    const bDate = new Date(b.date);
    if (isNaN(bDate)) return;
    const match = last6Months.find(lm => lm.m === monthNames[bDate.getMonth()] && lm.y === bDate.getFullYear());
    if (match) match.v += (parseInt(b.amount) || 0);
  });

  const chartData = last6Months.map(d => ({ m: d.m, v: d.v }));
  const maxV = Math.max(...chartData.map(d => d.v), 1000000); 
  const totalRev = chartData[chartData.length - 1].v; 

  return(
    <div style={{padding:"52px 20px 0"}}>
      
      {/* 1. HEADER (JUDUL & LONCENG) PALING ATAS */}
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16}}>
        <div>
          <RoleBadge role="admin"/>
          {/* Teks Header Dinamis */}
          <div style={{fontFamily:F.display,fontSize:28,color:T.text,letterSpacing:3,marginTop:8}}>
            {isSuperAdmin ? "SUPER ADMIN" : "BRANCH ADMIN"}
          </div>
        </div>
        <div onClick={onOpenNotif} style={{position:"relative", background:T.card, padding:10, borderRadius:12, border:`1px solid ${T.border}`, cursor:"pointer"}}>
          <span style={{fontSize:20}}>🔔</span>
          {notifications && notifications.filter(n => !n.is_read).length > 0 && (
            <div style={{position:"absolute", top:-5, right:-5, background:T.red, color:"#fff", fontSize:9, fontWeight:700, padding:"2px 6px", borderRadius:10}}>
              {notifications.filter(n => !n.is_read).length}
            </div>
          )}
        </div>
      </div>

      {/* 2. FILTER CABANG (HANYA MUNCUL JIKA SUPER ADMIN) */}
      {isSuperAdmin && (
        <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:4,marginBottom:16}}>
          {[{id:"ALL",name:"All Branches",color:accent},...branches.map(b=>({id:b.id,name:b.short,color:b.color}))].map(b=>(
            <div key={b.id} className="rp" onClick={()=>setSelBranch(b.id)} style={{padding:"6px 14px",borderRadius:20,fontSize:11,fontWeight:700,whiteSpace:"nowrap",background:selBranch===b.id?b.color:"transparent",color:selBranch===b.id?T.bg:T.muted,border:`1px solid ${selBranch===b.id?b.color:T.border}`,cursor:"pointer",transition:"all .2s",fontFamily:F.mono}}>{b.name}</div>
          ))}
        </div>
      )}

      {/* 3. INFO CABANG (HANYA MUNCUL JIKA ADMIN CABANG) */}
      {!isSuperAdmin && (
         <div style={{background:accent+"22", color:accent, padding:"10px 14px", borderRadius:12, marginBottom:16, fontWeight:700, fontSize:13, border:`1px solid ${accent}44`, display:"flex", alignItems:"center", gap:8}}>
            <span style={{fontSize:20}}>{branches.find(b=>b.id===selBranch)?.cover}</span>
            Dashboard: {branches.find(b=>b.id===selBranch)?.name}
         </div>
      )}

      {/* 4. LANJUT KE KONTEN DASHBOARD BAWAH */}
      {openTickets>0&&(
        <div className="rp" onClick={onOpenSupport} style={{background:T.cyan+"18",border:`1px solid ${T.cyan}44`,borderRadius:14,padding:"12px 14px",marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"}}>
          <div style={{fontSize:13,color:T.cyan,fontWeight:600}}>💬 {openTickets} open support ticket{openTickets>1?"s":""}</div>
          <div style={{fontSize:12,color:T.cyan,fontWeight:700}}>Respond →</div>
        </div>
      )}

      {pendingTransfers.length>0&&(
        <div style={{background:"#FFD70018",border:"1px solid #FFD70044",borderRadius:14,padding:"12px 14px",marginBottom:16,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{fontSize:13,color:T.yellow,fontWeight:600}}>⏳ {pendingTransfers.length} pending branch transfers</div>
          <div style={{fontSize:12,color:T.yellow,fontWeight:700,cursor:"pointer"}}>Review →</div>
        </div>
      )}

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
        {[
          {label:"Monthly Revenue",val:`Rp ${(totalRev/1000000).toFixed(1)}M`,sub:selBranch==="ALL"?"All branches":branches.find(b=>b.id===selBranch)?.short,icon:"💰",color:T.green},
          {label:"Active Members",     val:filtMembers.filter(m=>m.totalClasses>0).length,sub:`out of ${filtMembers.length} total`,icon:"👥",color:accent},
          {label:"Active Classes",      val:filtClasses.filter(c=>c.status==="active").length,sub:"this week",icon:"🏋️",color:T.lime},
          {label:"Today Bookings", val:bookings.filter(b=>selBranch==="ALL"||b.branchId===selBranch).length,sub:"+12% vs yesterday",icon:"📅",color:T.purple},
        ].map((k,i)=>(
          <div key={i} className="fu" style={{animationDelay:`${i*.05}s`,background:T.card,borderRadius:16,padding:16,border:`1px solid ${T.border}`}}>
            <div style={{display:"flex",justifyContent:"space-between"}}>
              <div style={{fontSize:10,color:T.muted,fontWeight:600,lineHeight:1.4,maxWidth:80}}>{k.label}</div>
              <div style={{fontSize:22}}>{k.icon}</div>
            </div>
            <div style={{fontFamily:F.display,fontSize:24,color:k.color,letterSpacing:1,marginTop:8,lineHeight:1}}>{k.val}</div>
            <div style={{fontSize:10,color:T.muted,marginTop:4}}>{k.sub}</div>
          </div>
        ))}
      </div>

      <div style={{background:T.card,borderRadius:18,padding:16,marginBottom:14,border:`1px solid ${T.border}`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <SecTitle title="REVENUE TREND" size={16}/>
          <div style={{fontFamily:F.display,fontSize:14,color:T.green}}>+11.6%</div>
        </div>
        <div style={{display:"flex",gap:5,alignItems:"flex-end",height:80}}>
          {chartData.map((d,i)=>{
            const h=Math.round((d.v/maxV)*70);
            const last=i===chartData.length-1;
            return(
              <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                <div style={{width:"100%",height:h,background:last?accent:T.borderHi,borderRadius:"3px 3px 0 0",minHeight:4}}/>
                <div style={{fontSize:8,color:last?accent:T.muted,fontFamily:F.mono}}>{d.m}</div>
              </div>
            );
          })}
        </div>
      </div>

      <SecTitle title="BRANCH BREAKDOWN" size={16}/>
      {branches.map((b,i)=>{
        const bMembers=members.filter(m=>m.branchId===b.id).length;
        const bClasses=classes.filter(c=>c.branchId===b.id&&c.status==="active").length;
        return(
          <div key={b.id} className="fu" style={{animationDelay:`${i*.04}s`,background:T.card,borderRadius:14,padding:"12px 14px",marginBottom:8,border:`1px solid ${T.border}`,display:"flex",gap:12,alignItems:"center"}}>
            <div style={{width:44,height:44,borderRadius:12,background:b.color+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{b.cover}</div>
            <div style={{flex:1}}>
              <div style={{fontFamily:F.display,fontSize:16,color:T.text,letterSpacing:1}}>{b.short}</div>
              <div style={{fontSize:11,color:T.muted}}>{bMembers} members · {bClasses} active classes</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontFamily:F.display,fontSize:16,color:b.color,letterSpacing:1}}>★ {b.rating}</div>
              <div style={{fontSize:10,color:T.muted,fontFamily:F.mono}}>{b.reviews} revs</div>
            </div>
          </div>
        );
      })}
      <div style={{height:8}}/>
    </div>
  );
}

function AdminFinance({ products, setProducts, sales, bookings, setBookings, setSyncQueue, accent }) { // <-- Hapus finReport dari parameter
  const [subTab, setSubTab] = useState("verify");
  const [prodModal, setProdModal] = useState(null); 
  const [searchVerify, setSearchVerify] = useState("");
  const [searchInv, setSearchInv] = useState("");

  // 🟢 KALKULATOR PROFIT/LOSS DINAMIS
  const verifiedBookings = bookings.filter(b => b.paymentStatus === "verified");
  const totalRev = verifiedBookings.reduce((sum, b) => sum + (parseInt(b.amount) || 0), 0); // <-- parseInt
  
  // Hitung modal (COGS) produk toko. Kelas & Subscription modalnya dianggap 0.
  const totalCost = verifiedBookings.reduce((sum, b) => {
    if (b.type === "purchase" && b.category !== "Subscription") {
       const p = products.find(x => x.id === b.productId || x.name === b.className);
       return sum + (parseInt(p?.cost) || 0); // <-- parseInt
    }
    return sum;
  }, 0);

  const netProfit = totalRev - totalCost;

  // Siapkan riwayat terbaru untuk ditampilkan di tabel
  const historyData = [...verifiedBookings].sort((a,b) => new Date(b.date) - new Date(a.date)).map(b => {
     let profit = parseInt(b.amount) || 0; // <-- parseInt
     if (b.type === "purchase" && b.category !== "Subscription") {
         const p = products.find(x => x.id === b.productId || x.name === b.className);
         profit -= (parseInt(p?.cost) || 0); // <-- parseInt
     }
     return { ...b, profit };
  });

  const finReport = {
    summary: { total_revenue: totalRev, store_cost: totalCost, net_profit: netProfit },
    history: historyData
  };

  const pendingBookings = bookings.filter(b => b.paymentStatus === "pending_verification" && (b.className.toLowerCase().includes(searchVerify.toLowerCase()) || b.id.toLowerCase().includes(searchVerify.toLowerCase())));
  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchInv.toLowerCase()));

  const handleSaveProduct = async (prod) => {
    const tempId = prod.id || "TEMP_" + Date.now();
    const productData = { ...prod, id: tempId };
    setProducts(prev => {
      const exists = prev.find(p => p.id === prod.id);
      return exists ? prev.map(p => p.id === prod.id ? productData : p) : [productData, ...prev];
    });
    const syncItem = { tempId, endpoint: '/admin/products/sync', data: productData };
    if (!navigator.onLine) {
      setSyncQueue(prev => [...prev, syncItem]);
      alert("Offline: Disimpan di lokal.");
    } else {
      try {
        const res = await fetch(API_URL + syncItem.endpoint, { method: 'POST', headers: API_HEADERS, body: JSON.stringify(productData) });
        if (!res.ok) setSyncQueue(prev => [...prev, syncItem]);
      } catch { setSyncQueue(prev => [...prev, syncItem]); }
    }
    setProdModal(null);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Hapus produk ini dari inventory?")) return;
    try {
      const res = await fetch(API_URL + '/admin/products/' + id, { method: 'DELETE', headers: API_HEADERS });
      if (res.ok) setProducts(prev => prev.filter(p => p.id !== id));
    } catch { alert("Gagal menghapus produk."); }
  };

  const handleImageUpload = (id, files) => {
    if(!files || files.length === 0) return;
    const currentProduct = products.find(p => p.id === id);
    const remaining = 3 - (currentProduct.images?.length || 0);
    if (remaining <= 0) { alert("Maksimal 3 foto!"); return; }

    Array.from(files).slice(0, remaining).forEach(file => {
       const reader = new FileReader();
       reader.onload = (e) => {
          const base64Data = e.target.result;
          const updatedProduct = {...currentProduct, images: [...(currentProduct.images||[]), base64Data]};
          setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));
          setSyncQueue(prev => [...prev, { tempId: "IMG_" + Date.now(), endpoint: '/admin/products/sync-image', data: { id, image: base64Data } }]);
       };
       reader.readAsDataURL(file);
    });
  };

  const removeImage = (id, index) => {
     setProducts(prev => prev.map(p => {
        if (p.id === id) {
           const newImgs = [...(p.images||[])];
           newImgs.splice(index, 1);
           return {...p, images: newImgs};
        }
        return p;
     }));
  };

  const handleStockUpdate = async (id, newStock) => {
    try {
      const res = await fetch(API_URL + '/admin/products/' + id, {
        method: 'PUT',
        headers: API_HEADERS,
        body: JSON.stringify({ stock: parseInt(newStock) || 0 })
      });
      if (res.ok) setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: parseInt(newStock) || 0 } : p));
    } catch { console.error("Gagal update stok"); }
  };

  const approvePayment = async (id) => {
    try {
      const res = await fetch(API_URL + '/admin/verify-payment/' + id, { method: 'POST', headers: API_HEADERS });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        setBookings(prev => prev.map(b => b.id === id ? {...b, paymentStatus: "verified"} : b));
      } else { alert("Gagal verifikasi: " + data.message); }
    } catch (error) { alert("Gagal terhubung ke server."); }
  };

  return (
    <div style={{ padding: "52px 20px 0" }}>
      {prodModal && <ProductModal product={prodModal==="add"?null:prodModal} onClose={()=>setProdModal(null)} onSave={handleSaveProduct} accent={accent} />}
      <SecTitle title="FINANCE & PAYMENTS" size={24} />
      
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <button onClick={() => setSubTab("verify")} style={{ flex: 1, padding: 10, background: subTab === "verify" ? accent : T.card, color: subTab === "verify" ? T.bg : T.text, borderRadius: 10, fontWeight: 700, position:"relative" }}>
          VERIFY {bookings.filter(b => b.paymentStatus === "pending_verification").length>0&&<span style={{position:"absolute", top:-5, right:-5, background:T.red, padding:"2px 6px", borderRadius:10, fontSize:9, color:"#fff"}}>{bookings.filter(b => b.paymentStatus === "pending_verification").length}</span>}
        </button>
        <button onClick={() => setSubTab("finance")} style={{ flex: 1, padding: 10, background: subTab === "finance" ? accent : T.card, color: subTab === "finance" ? T.bg : T.text, borderRadius: 10, fontWeight: 700 }}>PROFIT/LOSS</button>
        <button onClick={() => setSubTab("inventory")} style={{ flex: 1, padding: 10, background: subTab === "inventory" ? accent : T.card, color: subTab === "inventory" ? T.bg : T.text, borderRadius: 10, fontWeight: 700 }}>INVENTORY</button>
      </div>

      {subTab === "verify" && (
        <div className="fu">
          <div style={{fontSize:12, color:T.muted, marginBottom:10}}>BANK TRANSFER VERIFICATIONS</div>
          <input value={searchVerify} onChange={e=>setSearchVerify(e.target.value)} placeholder="🔍 Search transaction ID or item..." style={{width:"100%",background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"11px 16px",color:T.text,fontSize:13,marginBottom:14}}/>
          
          {pendingBookings.length === 0 ? <Empty icon="✅" title="NOT FOUND" sub="No pending payments match your search" /> : 
            pendingBookings.map(b => (
              <div key={b.id} style={{background:T.card, border:`1px solid ${T.yellow}66`, borderRadius:14, padding:14, marginBottom:10, display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                <div>
                  <div style={{fontFamily:F.display, fontSize:18, color:T.text, letterSpacing:1}}>{b.className}</div>
                  <div style={{fontSize:11, color:T.muted}}>ID: {b.id} · {b.date}</div>
                  <div style={{fontSize:14, color:T.yellow, fontWeight:700, marginTop:4}}>Rp {b.amount.toLocaleString("id")}</div>
                </div>
                <button onClick={()=>approvePayment(b.id)} style={{background:T.green, color:T.bg, padding:"10px 16px", borderRadius:10, fontWeight:700, border:"none"}}>APPROVE</button>
              </div>
            ))
          }
        </div>
      )}

      {subTab === "finance" && (
        <div className="fu">
          <div style={{ background: `linear-gradient(135deg, ${T.cardHi}, ${T.surface})`, padding: 24, borderRadius: 24, border: `1px solid ${T.borderHi}` }}>
            <div style={{ fontSize: 12, color: T.muted }}>TOTAL NET PROFIT</div>
            <div style={{ fontSize: 32, fontFamily: F.display, color: T.green }}>Rp {(finReport?.summary?.net_profit || 0).toLocaleString("id")}</div>
            <div style={{ display: "flex", gap: 20, marginTop: 15, borderTop: `1px solid ${T.border}`, paddingTop: 15 }}>
              <div>
                <div style={{ fontSize: 9, color: T.muted, letterSpacing: 1 }}>TOTAL REVENUE</div>
                <div style={{ fontWeight: 700 }}>Rp {(finReport?.summary?.total_revenue || 0).toLocaleString("id")}</div>
              </div>
              <div>
                <div style={{ fontSize: 9, color: T.muted, letterSpacing: 1 }}>TOTAL COGS</div>
                <div style={{ fontWeight: 700 }}>Rp {(finReport?.summary?.store_cost || 0).toLocaleString("id")}</div>
              </div>
            </div>
          </div>
          
          <h3 style={{ fontFamily: F.display, marginTop: 20, marginBottom: 10, color: T.muted }}>TRANSACTION HISTORY</h3>
          {(finReport?.history || []).length === 0 ? <div style={{ fontSize: 12, color: T.muted }}>No verified transactions yet.</div> : (finReport?.history || []).map(s => (
            <div key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems:"center", fontSize: 12, padding: "10px 0", borderBottom: `1px solid ${T.border}`, fontFamily: F.mono }}>
              <div>
                <div style={{color: T.text}}>{s.className || s.productName || "Transaction"}</div>
                <div style={{fontSize: 9, color: T.muted, marginTop: 4}}>{s.category || s.type} · {s.date}</div>
              </div>
              <span style={{ color: T.green, fontWeight: 700, fontSize:13 }}>+{(s.profit || 0).toLocaleString("id")}</span>
            </div>
          ))}
        </div>
      )}

      {subTab === "inventory" && (
        <div className="fu">
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12}}>
            <div style={{fontSize:13, color:T.muted}}>Manage Store Items</div>
            <button onClick={() => setProdModal("add")} style={{background:accent, color:T.bg, borderRadius:12, padding:"8px 14px", fontFamily:F.display, fontSize:14, letterSpacing:1, fontWeight:700}}>+ ADD ITEM</button>
          </div>
          
          <input value={searchInv} onChange={e=>setSearchInv(e.target.value)} placeholder="🔍 Search product name..." style={{width:"100%",background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"11px 16px",color:T.text,fontSize:13,marginBottom:16}}/>

          {filteredProducts.length === 0 ? <Empty icon="📦" title="NOT FOUND" sub="Check spelling" /> : 
          filteredProducts.map(p => (
            <div key={p.id} style={{ background: T.card, borderRadius: 12, marginBottom: 12, border: `1px solid ${T.border}`, overflow:"hidden" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 15 }}>
                <div style={{flex:1, minWidth:0}}>
                  <span style={{ fontSize: 20, marginRight: 10 }}>{p.icon}</span>
                  <span style={{ fontWeight: 700 }}>{p.name}</span>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink:0 }}>
                  <div className="rp" onClick={() => setProdModal(p)} style={{fontSize:11, color:T.cyan, cursor:"pointer", padding:"5px 10px", border:`1px dashed ${T.cyan}44`, borderRadius:8, fontWeight:700}}>Edit</div>
                  <div className="rp" onClick={() => handleDeleteProduct(p.id)} style={{fontSize:11, color:T.red, cursor:"pointer", padding:"5px 10px", border:`1px dashed ${T.red}44`, borderRadius:8, fontWeight:700}}>✕</div>
                  <input type="number" value={p.stock} onChange={(e) => handleStockUpdate(p.id, e.target.value)} style={{ width: 50, background: T.bg, border: `1px solid ${T.borderHi}`, color: T.text, padding: 5, borderRadius: 6, textAlign: "center", fontFamily: F.mono }} />
                </div>
              </div>
              
              <div style={{ padding: "0 15px 15px", borderTop: `1px dashed ${T.borderHi}`, marginTop: -5, paddingTop: 10 }}>
                <div style={{ fontSize: 10, color: T.muted, marginBottom: 8, fontFamily:F.mono }}>PHOTOS (MAX 3)</div>
                <div style={{ display: "flex", gap: 10 }}>
                  {(p.images||[]).map((img, idx) => (
                    <div key={idx} style={{ position: "relative", width: 50, height: 50, borderRadius: 8, backgroundImage: `url(${img})`, backgroundSize: "cover", backgroundPosition: "center", border:`1px solid ${T.borderHi}` }}>
                      <div onClick={() => removeImage(p.id, idx)} style={{ position:"absolute", top:-6, right:-6, background:T.red, color:"#fff", width:18, height:18, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, cursor:"pointer", fontWeight:700, zIndex:2 }}>✕</div>
                    </div>
                  ))}
                  {(p.images||[]).length < 3 && (
                    <label style={{ width: 50, height: 50, borderRadius: 8, border: `1px dashed ${T.borderHi}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, color:T.muted, cursor:"pointer", background:T.bg }}>
                      +
                      <input type="file" accept="image/*" multiple onChange={e => handleImageUpload(p.id, e.target.files)} style={{ display: "none" }} />
                    </label>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AdminMembers({members,setUsers,branches,onAdd,accent,onTransferAction,transfers,onEditUser}){
  const [search,setSearch]=useState("");
  const [selBranch,setSelBranch]=useState("ALL");
  const [filterDue,setFilterDue]=useState(false);

  const filtered=members.filter(m=>{
    const ms=m.name?.toLowerCase().includes(search.toLowerCase())||m.email?.toLowerCase().includes(search.toLowerCase());
    const bf=selBranch==="ALL"||m.branchId===selBranch;
    const isDue = filterDue ? (getDaysLeft(m) !== "–" && getDaysLeft(m) <= 7) : true;
    return ms&&bf&&isDue;
  });

  const pendingForMember=(uid)=>transfers.find(t=>t.userId===uid&&t.status==="pending");
  // Toggle uses dedicated `status` field: "active" | "inactive". Plan is never mutated.
  const toggle=(id)=>setUsers(prev=>prev.map(u=>u.id===id?{...u,status:u.status==="inactive"?"active":"inactive"}:u));
  // Helper: a member is considered active if status is not "inactive"
  const isActive=(m)=>m.status!=="inactive";
  return(
    <div style={{padding:"52px 20px 0"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:14}}>
        <div><RoleBadge role="admin" small/><SecTitle title="MANAGE MEMBERS" size={24}/></div>
        <button onClick={onAdd} style={{background:accent,color:T.bg,borderRadius:12,padding:"9px 16px",fontFamily:F.display,fontSize:13,letterSpacing:1}}>+ ADD</button>
      </div>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search name or email..." style={{width:"100%",background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"11px 16px",color:T.text,fontSize:13,marginBottom:10}}/>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:14}}>
        <div style={{display:"flex",gap:7,overflowX:"auto",paddingBottom:4,flex:1}}>
          {[{id:"ALL",name:"All",color:accent},...branches.map(b=>({id:b.id,name:b.short,color:b.color}))].map(b=>(
            <div key={b.id} className="rp" onClick={()=>setSelBranch(b.id)} style={{padding:"5px 12px",borderRadius:20,fontSize:10,fontWeight:700,whiteSpace:"nowrap",background:selBranch===b.id?b.color:"transparent",color:selBranch===b.id?T.bg:T.muted,border:`1px solid ${selBranch===b.id?b.color:T.border}`,cursor:"pointer",transition:"all .2s",fontFamily:F.mono}}>{b.name}</div>
          ))}
        </div>
        <div className="rp" onClick={()=>setFilterDue(!filterDue)} style={{padding:"5px 10px",borderRadius:20,fontSize:10,fontWeight:700,background:filterDue?T.yellow:T.card,color:filterDue?"#000":T.yellow,border:`1px solid ${T.yellow}44`,cursor:"pointer",whiteSpace:"nowrap"}}>
          ⚠️ Due Soon
        </div>
      </div>
      {filtered.map((m,i)=>{
        const br=branches.find(b=>b.id===m.branchId);
        const pending=pendingForMember(m.id);
        return(
          <div key={m.id} className="fu" style={{animationDelay:`${i*.04}s`,background:T.card,borderRadius:16,padding:14,marginBottom:10,border:`1px solid ${pending?"#FFD70044":T.border}`}}>
            <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
              <div style={{width:46,height:46,borderRadius:13,background:accent+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{m.avatar}</div>
              <div style={{flex:1}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  <div>
                    <div style={{fontWeight:700,color:T.text,fontSize:14}}>{m.name}</div>
                    <div style={{fontSize:11,color:T.muted}}>{m.email}</div>
                  </div>
                  <div className="rp" onClick={()=>toggle(m.id)} style={{padding:"3px 10px",borderRadius:20,fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:F.mono,letterSpacing:1,background:isActive(m)?T.green+"22":"#FF313122",color:isActive(m)?T.green:T.red,border:`1px solid ${isActive(m)?T.green+"44":"#FF313144"}`}}>
                    {isActive(m)?"ACTIVE":"INACTIVE"}
                  </div>
                </div>
                <div style={{display:"flex",gap:10,marginTop:7,alignItems:"center",flexWrap:"wrap"}}>
                  <span style={{fontSize:11,color:T.muted}}>📋 {m.plan}</span>
                  <span style={{fontSize:11,color:T.muted}}>🏋️ {m.totalClasses||0}x</span>
                  <span style={{fontSize:10,color:T.dim,fontFamily:F.mono}}>Since {m.joinDate}</span>
                  {getLastPaymentDate(m) && <span style={{fontSize:10,color:T.green,fontFamily:F.mono}}>Last Paid: {getLastPaymentDate(m).toLocaleDateString("en-GB", {day:"numeric", month:"short"})}</span>}
                  {br&&<span style={{fontSize:10,color:br.color,background:br.color+"18",padding:"1px 8px",borderRadius:10,fontWeight:700,fontFamily:F.mono}}>{br.cover} {br.short}</span>}
                </div>
                {getDaysLeft(m) !== "–" && getDaysLeft(m) <= 7 && (
                  <div style={{marginTop:8,background:"#FFD70018",border:"1px solid #FFD70044",borderRadius:10,padding:"6px 10px",fontSize:11,color:T.yellow,fontWeight:600}}>
                    ⚠️ Membership due in {getDaysLeft(m)} days ({getNextBillingDate(m)?.toLocaleDateString("en-GB")})
                  </div>
                )}
                {pending&&(
                  <div className="rp" onClick={()=>onTransferAction(pending)} style={{marginTop:8,background:"#FFD70018",border:"1px solid #FFD70044",borderRadius:10,padding:"7px 10px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div style={{fontSize:11,color:T.yellow}}>⏳ Req transfer → {branches.find(b=>b.id===pending.toBranchId)?.short}</div>
                    <div style={{fontSize:11,color:T.yellow,fontWeight:700}}>Review →</div>
                  </div>
                )}
                {onEditUser&&(
                  <div className="rp" onClick={()=>onEditUser(m)} style={{marginTop:8,padding:"7px 12px",borderRadius:10,border:`1px dashed ${accent}44`,textAlign:"center",fontSize:11,color:accent,cursor:"pointer",fontWeight:700}}>
                    ✏️ Edit Profile
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
      <div style={{height:8}}/>
    </div>
  );
}

function AdminTrainers({trainers,branches,classes,logs,onMove,updateTrainerStatus,accent,onEditTrainer,getTrainerStats}){
  const [moveModal,setMoveModal]=useState(null);
  const [selBranch,setSelBranch]=useState("ALL");
  const [search,setSearch]=useState(""); // STATE PENCARIAN BARU

  const filtered = trainers.filter(t => {
    const matchBranch = selBranch === "ALL" || t.branchId === selBranch;
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase());
    return matchBranch && matchSearch;
  });

  return(
    <div style={{padding:"52px 20px 0"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:14}}>
        <div><RoleBadge role="admin" small/><SecTitle title="TRAINER MANAGEMENT" size={24}/></div>
      </div>
      
      {/* INPUT PENCARIAN */}
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search trainer name..." style={{width:"100%",background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"11px 16px",color:T.text,fontSize:13,marginBottom:10}}/>

      <div style={{display:"flex",gap:7,overflowX:"auto",marginBottom:14,paddingBottom:4}}>
        {[{id:"ALL",name:"All",color:accent},...branches.map(b=>({id:b.id,name:b.short,color:b.color}))].map(b=>(
          <div key={b.id} className="rp" onClick={()=>setSelBranch(b.id)} style={{padding:"5px 12px",borderRadius:20,fontSize:10,fontWeight:700,whiteSpace:"nowrap",background:selBranch===b.id?b.color:"transparent",color:selBranch===b.id?T.bg:T.muted,border:`1px solid ${selBranch===b.id?b.color:T.border}`,cursor:"pointer",transition:"all .2s",fontFamily:F.mono}}>{b.name}</div>
        ))}
      </div>

      {moveModal&&(
        <Modal onClose={()=>setMoveModal(null)}>
          <div style={{padding:"28px 24px 40px"}}>
            <div style={{fontFamily:F.display,fontSize:24,color:T.text,letterSpacing:2,marginBottom:4}}>MOVE TRAINER</div>
            <div style={{fontSize:13,color:T.muted,marginBottom:20}}>{moveModal.name} → select target branch</div>
            {branches.filter(b=>b.id!==moveModal.branchId).map(b=>(
              <div key={b.id} className="rp" onClick={()=>{onMove(moveModal.id,b.id);setMoveModal(null);}} style={{background:T.card,border:`1px solid ${b.color}44`,borderRadius:14,padding:"12px 14px",marginBottom:8,cursor:"pointer",display:"flex",gap:12,alignItems:"center",transition:"all .2s"}}>
                <span style={{fontSize:22}}>{b.cover}</span>
                <div>
                  <div style={{fontWeight:700,color:T.text}}>{b.name}</div>
                  <div style={{fontSize:11,color:T.muted}}>{b.area}</div>
                </div>
              </div>
            ))}
            <button onClick={()=>setMoveModal(null)} style={{width:"100%",padding:12,borderRadius:12,background:"transparent",color:T.muted,fontSize:14,fontWeight:600,border:`1px solid ${T.border}`,marginTop:8}}>CANCEL</button>
          </div>
        </Modal>
      )}

      {filtered.length === 0 ? <Empty icon="🔍" title="NOT FOUND" sub="No trainer matches your search" /> : 
      filtered.map((tr,i)=>{
        const br=branches.find(b=>b.id===tr.branchId);
        const trClasses = classes.filter(c => c.trainerId === tr.id);
        const trStudents = trClasses.reduce((sum, c) => sum + (c.total - c.slots), 0);
        let hrs = 0;
        const history = logs[tr.id]?.history || [];
        for(let j=0; j<history.length; j+=2){
           if(history[j+1]) hrs += (new Date(history[j+1].time) - new Date(history[j].time))/(1000*60*60);
        }
        const isReleased = tr.status === "released";
        const isOff = tr.status === "inactive";

        return(
          <div key={tr.id} className="fu" style={{animationDelay:`${i*.05}s`,background:T.card,borderRadius:18,padding:16,marginBottom:12,border:`1px solid ${isReleased?T.red+"66":T.border}`, opacity:isReleased?0.6:1}}>
            <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
              <div style={{width:52,height:52,borderRadius:14,background:br?br.color+"22":T.cardHi,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>{tr.avatar}</div>
              <div style={{flex:1}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  <div>
                    <div style={{fontFamily:F.display,fontSize:18,color:T.text,letterSpacing:1.5,lineHeight:1, textDecoration:isReleased?"line-through":"none"}}>{tr.name}</div>
                    <div style={{fontSize:12,color:T.muted,marginTop:2}}>{tr.specialty}</div>
                  </div>
                  <div style={{display:"flex",gap:6,alignItems:"center"}}>
                    <Chip color={T.yellow} text={`★ ${getTrainerStats(tr.id).avg}`}/>
                  </div>
                </div>
                <div style={{display:"flex",gap:8,marginTop:8,alignItems:"center"}}>
                  {br&&<span style={{fontSize:10,color:br.color,background:br.color+"18",padding:"2px 8px",borderRadius:10,fontWeight:700,fontFamily:F.mono}}>{br.cover} {br.short}</span>}
                </div>
              </div>
            </div>

            <div style={{display:"flex", gap:10, marginTop:14, background:T.bg, padding:"12px 10px", borderRadius:12, border:`1px solid ${T.borderHi}`}}>
              <div style={{flex:1, textAlign:"center", borderRight:`1px solid ${T.border}`}}>
                <div style={{fontSize:20, color:T.cyan, fontFamily:F.display, letterSpacing:1}}>{hrs.toFixed(1)}h</div>
                <div style={{fontSize:9, color:T.muted, fontFamily:F.mono}}>WORKED</div>
              </div>
              <div style={{flex:1, textAlign:"center", borderRight:`1px solid ${T.border}`}}>
                <div style={{fontSize:20, color:T.lime, fontFamily:F.display, letterSpacing:1}}>{trClasses.length}</div>
                <div style={{fontSize:9, color:T.muted, fontFamily:F.mono}}>CLASSES</div>
              </div>
              <div style={{flex:1, textAlign:"center"}}>
                <div style={{fontSize:20, color:accent, fontFamily:F.display, letterSpacing:1}}>{trStudents}</div>
                <div style={{fontSize:9, color:T.muted, fontFamily:F.mono}}>STUDENTS</div>
              </div>
            </div>

            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:14, padding:"10px", background:T.bg, borderRadius:12, border:`1px solid ${T.borderHi}`}}>
              <div style={{fontSize:11, color:T.muted, fontWeight:700}}>STATUS</div>
              {isReleased ? (
                <div style={{color:T.red, fontSize:11, fontWeight:700, fontFamily:F.mono}}>RELEASED (PERMANENT)</div>
              ) : (
                <select value={tr.status || "active"} onChange={(e) => updateTrainerStatus(tr.id, e.target.value)} style={{background:T.card, color:isOff?T.red:T.green, border:`1px solid ${T.border}`, borderRadius:8, padding:"4px 8px", fontSize:11, fontWeight:700, fontFamily:F.mono, outline:"none"}}>
                  <option value="active">ON (ACTIVE)</option>
                  <option value="inactive">OFF (INACTIVE)</option>
                  <option value="released">RELEASED</option>
                </select>
              )}
            </div>

            {!isReleased && (
              <div style={{display:"flex",gap:8,marginTop:10}}>
                <div className="rp" onClick={()=>setMoveModal(tr)} style={{flex:1,padding:"8px 12px",borderRadius:10,border:`1px dashed ${accent}44`,textAlign:"center",fontSize:12,color:accent,fontWeight:700,cursor:"pointer"}}>
                  🔀 Move Branch
                </div>
                {onEditTrainer&&(
                  <div className="rp" onClick={()=>onEditTrainer(tr)} style={{flex:1,padding:"8px 12px",borderRadius:10,border:`1px dashed ${T.lime}44`,textAlign:"center",fontSize:12,color:T.lime,fontWeight:700,cursor:"pointer"}}>
                    ✏️ Edit Profile
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
      <div style={{height:8}}/>
    </div>
  );
}

function AdminClasses({classes,setClasses,branches,trainers,onAdd,onEdit,accent}){
  const [selBranch,setSelBranch]=useState("ALL");
  const [search,setSearch]=useState(""); // STATE PENCARIAN BARU

  const filtered=classes.filter(c=>{
    const matchBranch = selBranch==="ALL"||c.branchId===selBranch;
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    return matchBranch && matchSearch;
  });

  const toggle = async (id) => {
    try {
      const res = await fetch(API_URL + '/admin/classes/' + id + '/toggle', { method: 'POST', headers: API_HEADERS });
      if(res.ok) setClasses(p => p.map(c => c.id === id ? {...c, status: c.status === "active" ? "cancelled" : "active"} : c));
    } catch(e) { console.error("Gagal toggle status kelas"); }
  };

  return(
    <div style={{padding:"52px 20px 0"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:14}}>
        <div><RoleBadge role="admin" small/><SecTitle title="MANAGE CLASSES" size={24}/></div>
        <button onClick={onAdd} style={{background:accent,color:T.bg,borderRadius:12,padding:"9px 16px",fontFamily:F.display,fontSize:13,letterSpacing:1}}>+ ADD</button>
      </div>

      {/* INPUT PENCARIAN */}
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search class name..." style={{width:"100%",background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"11px 16px",color:T.text,fontSize:13,marginBottom:10}}/>

      <div style={{display:"flex",gap:7,overflowX:"auto",marginBottom:14,paddingBottom:4}}>
        {[{id:"ALL",name:"All",color:accent},{id:"ONLINE",name:"Online 🌐",color:T.blue},...branches.map(b=>({id:b.id,name:b.short,color:b.color}))].map(b=>(
          <div key={b.id} className="rp" onClick={()=>setSelBranch(b.id)} style={{padding:"5px 12px",borderRadius:20,fontSize:10,fontWeight:700,whiteSpace:"nowrap",background:selBranch===b.id?b.color:"transparent",color:selBranch===b.id?T.bg:T.muted,border:`1px solid ${selBranch===b.id?b.color:T.border}`,cursor:"pointer",transition:"all .2s",fontFamily:F.mono}}>{b.name}</div>
        ))}
      </div>
      
      {filtered.length === 0 ? <Empty icon="🔍" title="NOT FOUND" sub="No class matches your search" /> : 
      filtered.map((cls,i)=>{
        const br=branches.find(b=>b.id===cls.branchId)||(cls.branchId==="ONLINE"?{color:T.blue,cover:"🌐",short:"ONLINE"}:{color:T.muted,cover:"?",short:"?"});
        const isOnline=cls.branchId==="ONLINE";
        return(
          <div key={cls.id} className="fu" style={{animationDelay:`${i*.04}s`,background:T.card,borderRadius:16,padding:14,marginBottom:10,border:`1px solid ${cls.status==="cancelled"?"#FF313144":isOnline?T.blue+"33":T.border}`,opacity:cls.status==="cancelled"?.55:1}}>
            <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
              <div style={{width:46,height:46,borderRadius:13,background:cls.color+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{cls.icon}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
                  <div style={{minWidth:0}}>
                    <div style={{fontFamily:F.display,fontSize:17,color:T.text,letterSpacing:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{cls.name}{isOnline?" 🌐":""}</div>
                    <div style={{fontSize:11,color:T.muted,marginTop:1}}>{cls.day} {cls.time} · {cls.duration}</div>
                  </div>
                  <div className="rp" onClick={()=>toggle(cls.id)} style={{flexShrink:0,padding:"3px 10px",borderRadius:20,fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:F.mono,background:cls.status==="active"?T.green+"22":"#FF313122",color:cls.status==="active"?T.green:T.red,border:`1px solid ${cls.status==="active"?T.green+"44":"#FF313144"}`}}>
                    {cls.status==="active"?"ACTIVE":"OFF"}
                  </div>
                </div>
                {isOnline&&cls.videoUrl&&(
                  <div style={{display:"flex",alignItems:"center",gap:6,marginTop:6,background:T.blue+"18",borderRadius:8,padding:"5px 8px"}}>
                    <span style={{fontSize:11}}>🎬</span>
                    <div style={{fontSize:10,color:T.blue,fontFamily:F.mono,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1}}>{cls.videoUrl}</div>
                  </div>
                )}
                {isOnline&&!cls.videoUrl&&(
                  <div style={{marginTop:6,fontSize:10,color:T.yellow}}>⚠️ No video link set</div>
                )}
                <div style={{display:"flex",gap:8,marginTop:8,alignItems:"center"}}>
                  <span style={{fontSize:10,color:br.color,background:br.color+"18",padding:"2px 8px",borderRadius:10,fontWeight:700,fontFamily:F.mono,flexShrink:0}}>{br.cover} {br.short}</span>
                  <div style={{flex:1,height:3,background:T.border,borderRadius:4,overflow:"hidden",maxWidth:80}}>
                    <div style={{width:`${Math.round(((cls.total-cls.slots)/cls.total)*100)}%`,height:"100%",background:cls.color,borderRadius:4}}/>
                  </div>
                  <span style={{fontSize:11,color:T.muted,fontFamily:F.mono,flexShrink:0}}>{cls.total-cls.slots}/{cls.total}</span>
                </div>
                {onEdit&&(
                  <div className="rp" onClick={()=>onEdit(cls)} style={{marginTop:8,padding:"7px 12px",borderRadius:10,border:`1px dashed ${accent}44`,textAlign:"center",fontSize:11,color:accent,cursor:"pointer",fontWeight:700}}>
                    ✏️ Edit Class{isOnline?" & Video Link":""}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
      <div style={{height:8}}/>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MODALS (ADMIN & SHARED)
═══════════════════════════════════════════════════════════════ */
function AdminProfile({user,onLogout,pendingTransfers,onTransferAction,onOpenBroadcast,onOpenGymSettings,onOpenPlanSettings,onOpenReports,onOpenSecurity,onOpenSupport,onOpenBadges,openTickets,accent,branches}){
  return(
    <div style={{padding:"52px 20px 0"}}>
      <div style={{background:`linear-gradient(140deg,${T.card},${T.surface})`,borderRadius:20,padding:20,marginBottom:16,border:`1px solid ${T.border}`}}>
        <div style={{display:"flex",gap:14,alignItems:"center"}}>
          <div style={{width:68,height:68,borderRadius:18,background:`linear-gradient(135deg,${accent},#CC4400)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:30,border:`2px solid ${accent}44`}}>{user.avatar}</div>
          <div>
            <RoleBadge role="admin"/>
            <div style={{fontFamily:F.display,fontSize:22,color:T.text,letterSpacing:2,marginTop:6}}>{user.name.toUpperCase()}</div>
            <div style={{fontSize:12,color:T.muted,marginTop:2}}>{user.email}</div>
          </div>
        </div>
      </div>

      {pendingTransfers.length>0&&(
        <div style={{marginBottom:16}}>
          <div style={{fontSize:11,color:T.yellow,fontFamily:F.mono,letterSpacing:2,marginBottom:10}}>TRANSFER REQUESTS ({pendingTransfers.length})</div>
          {pendingTransfers.map(tr=>{
            const fromB = branches?.find(b=>b.id===tr.fromBranchId);
            const toB   = branches?.find(b=>b.id===tr.toBranchId);
            return(
            <div key={tr.id} className="rp" onClick={()=>onTransferAction(tr)} style={{background:"#FFD70018",border:"1px solid #FFD70044",borderRadius:14,padding:"12px 14px",marginBottom:8,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontWeight:700,color:T.text,fontSize:13}}>{tr.name}</div>
                <div style={{fontSize:11,color:T.muted,marginTop:2}}>
                  {fromB?`${fromB.cover} ${fromB.short}`:tr.fromBranchId} → {toB?`${toB.cover} ${toB.short}`:tr.toBranchId} · {tr.date}
                </div>
                <div style={{fontSize:11,color:T.yellow,fontStyle:"italic",marginTop:2}}>"{tr.reason}"</div>
              </div>
              <div style={{fontSize:12,color:T.yellow,fontWeight:700}}>Review →</div>
            </div>
            );
          })}
        </div>
      )}

      {/* Admin Profile Actions */}
      <div onClick={onOpenBroadcast}><MenuIt icon="📢" label="Send Broadcast" sub="Push notification to all members"/></div>
      <div onClick={onOpenBadges}><MenuIt icon="🏆" label="Manage Achievements" sub="Set rules and create badges"/></div>
      
      {!user.branchId && (
        <div onClick={onOpenPlanSettings}><MenuIt icon="💳" label="Membership Plans" sub="Manage pricing and packages"/></div>
      )}
      
      <div onClick={onOpenSupport}><MenuIt icon="💬" label="Support Inbox" sub={openTickets>0?`${openTickets} open ticket${openTickets>1?"s":""}`:""} badge={openTickets}/></div>
      <div onClick={onOpenGymSettings}><MenuIt icon="⚙️" label="Gym Settings" sub="Hours, capacity, facilities per branch"/></div>
      <div onClick={onOpenReports}><MenuIt icon="📋" label="Full Reports" sub="Revenue, members & class analytics"/></div>
      <div onClick={onOpenSecurity}><MenuIt icon="🔐" label="Security" sub="Password, 2FA & login history"/></div>

      <div className="rp" onClick={onLogout} style={{background:"#FF313118",borderRadius:14,padding:"14px 16px",marginTop:8,border:"1px solid #FF313133",display:"flex",alignItems:"center",gap:14,cursor:"pointer"}}>
        <div style={{width:40,height:40,borderRadius:12,background:"#FF313133",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>🚪</div>
        <div style={{fontWeight:700,color:T.red,fontSize:14}}>Logout</div>
      </div>
      <div style={{height:20}}/>
    </div>
  );
}

function TransferActionModal({tr,branches,onApprove,onReject,onClose}){
  const fromB=branches.find(b=>b.id===tr.fromBranchId);
  const toB=branches.find(b=>b.id===tr.toBranchId);
  return(
    <Modal onClose={onClose}>
      <div style={{padding:"28px 24px 40px"}}>
        <div style={{fontFamily:F.display,fontSize:24,color:T.text,letterSpacing:2,marginBottom:4}}>REVIEW TRANSFER</div>
        <div style={{fontSize:13,color:T.muted,marginBottom:20}}>Branch transfer request</div>
        <div style={{background:T.card,borderRadius:16,padding:16,marginBottom:16,border:`1px solid ${T.border}`}}>
          <div style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:12}}>{tr.name}</div>
          <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:10}}>
            <div style={{flex:1,background:fromB?.color+"18",borderRadius:12,padding:"10px",border:`1px solid ${fromB?.color}44`,textAlign:"center"}}>
              <div style={{fontSize:20}}>{fromB?.cover}</div>
              <div style={{fontSize:11,fontWeight:700,color:fromB?.color,marginTop:4}}>{fromB?.short}</div>
            </div>
            <div style={{fontSize:20,color:T.muted}}>→</div>
            <div style={{flex:1,background:toB?.color+"18",borderRadius:12,padding:"10px",border:`1px solid ${toB?.color}44`,textAlign:"center"}}>
              <div style={{fontSize:20}}>{toB?.cover}</div>
              <div style={{fontSize:11,fontWeight:700,color:toB?.color,marginTop:4}}>{toB?.short}</div>
            </div>
          </div>
          <div style={{background:T.bg,borderRadius:10,padding:"10px 12px",fontSize:12,color:T.muted,borderLeft:`2px solid ${T.orange}`,fontStyle:"italic"}}>
            "{tr.reason}"
          </div>
          <div style={{fontSize:11,color:T.dim,marginTop:8,fontFamily:F.mono}}>{tr.date}</div>
        </div>
        <div style={{display:"flex",gap:10}}>
          <button onClick={()=>onApprove(tr)} style={{flex:1,padding:14,borderRadius:12,fontFamily:F.display,fontSize:17,letterSpacing:1,background:T.green,color:"#000",fontWeight:700}}>✓ APPROVE</button>
          <button onClick={()=>onReject(tr)}  style={{flex:1,padding:14,borderRadius:12,fontFamily:F.display,fontSize:17,letterSpacing:1,background:T.red,   color:"#fff",fontWeight:700}}>✕ REJECT</button>
        </div>
        <button onClick={onClose} style={{width:"100%",padding:12,borderRadius:12,background:"transparent",color:T.muted,fontSize:14,fontWeight:600,border:`1px solid ${T.border}`,marginTop:8}}>CANCEL</button>
      </div>
    </Modal>
  );
}

function AdminBadgesModal({badges, setBadges, onClose, accent}) {
  const [view, setView] = useState("list"); 
  const [f, setF] = useState({ id:null, icon: "🏆", name: "", desc: "", ruleType: "class_count", targetValue: 1 });
  const [loading, setLoading] = useState(false);

  const resetF = () => setF({ id:null, icon: "🏆", name: "", desc: "", ruleType: "class_count", targetValue: 1 });

  const handleSave = async () => {
    if(!f.name || !f.desc || !f.targetValue) return;
    setLoading(true);
    
    const isEdit = !!f.id;
    const endpoint = isEdit ? `/admin/badges/${f.id}` : `/admin/badges`;
    const method = isEdit ? 'PUT' : 'POST';
    
    const payload = {
      icon: f.icon, name: f.name, desc: f.desc, 
      rule_type: f.ruleType, target_value: parseInt(f.targetValue)||1
    };

    try {
      const res = await fetch(API_URL + endpoint, {
        method,
        headers: API_HEADERS,
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if(res.ok) {
        const savedBadge = { id: data.data.id, ...f, targetValue: payload.target_value };
        if (isEdit) setBadges(prev => prev.map(b => b.id === f.id ? savedBadge : b));
        else setBadges(prev => [...prev, savedBadge]);
        setView("list");
      }
    } catch(e) { alert("Error connecting to server"); }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Hapus badge ini?")) return;
    try {
      const res = await fetch(API_URL + '/admin/badges/' + id, { method: 'DELETE', headers: API_HEADERS });
      if(res.ok) setBadges(prev => prev.filter(b => b.id !== id));
    } catch(e) { console.error(e); }
  };

  return(
    <Modal onClose={onClose}>
      <div style={{padding:"28px 24px 40px"}}>
        {view==="list" ? (
          <>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <div style={{fontFamily:F.display,fontSize:26,color:T.text,letterSpacing:2}}>BADGES</div>
              <button onClick={()=>{resetF();setView("form");}} style={{background:accent,color:T.bg,borderRadius:12,padding:"6px 12px",fontFamily:F.display,fontSize:14,letterSpacing:1,fontWeight:700}}>+ NEW</button>
            </div>
            <div style={{fontSize:13,color:T.muted,marginBottom:20}}>Badges will be automatically awarded to members based on rules.</div>
            
            {badges.length===0?<Empty icon="🏆" title="NO BADGES" sub="Create your first achievement"/>:
              badges.map((b,i)=>(
                <div key={b.id} className="fu" style={{animationDelay:`${i*.04}s`,background:T.card,borderRadius:14,padding:14,marginBottom:10,border:`1px solid ${T.border}`,display:"flex",alignItems:"center",gap:14}}>
                  <div style={{fontSize:36,background:accent+"18",width:56,height:56,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center"}}>{b.icon}</div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:700,fontSize:14,color:T.text}}>{b.name}</div>
                    <div style={{fontSize:11,color:T.muted,marginBottom:4}}>{b.desc}</div>
                    <div style={{fontSize:9,padding:"2px 8px",background:T.surface,border:`1px solid ${T.borderHi}`,display:"inline-block",borderRadius:8,color:accent,fontFamily:F.mono}}>
                      IF {b.ruleType.toUpperCase()} {'>='} {b.targetValue}
                    </div>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:6}}>
                    <div onClick={()=>{setF(b);setView("form");}} className="rp" style={{fontSize:12,color:T.cyan,fontWeight:700,cursor:"pointer",background:T.cyan+"22",padding:"4px 10px",borderRadius:8}}>Edit</div>
                    <div onClick={()=>handleDelete(b.id)} className="rp" style={{fontSize:12,color:T.red,fontWeight:700,cursor:"pointer",background:T.red+"22",padding:"4px 10px",borderRadius:8}}>Del</div>
                  </div>
                </div>
              ))
            }
          </>
        ) : (
          <>
            <div onClick={()=>setView("list")} style={{display:"flex",alignItems:"center",gap:8,color:T.muted,fontSize:13,cursor:"pointer",marginBottom:16,fontWeight:600}}>← Back</div>
            <div style={{fontFamily:F.display,fontSize:24,color:T.text,letterSpacing:2,marginBottom:18}}>{f.id?"EDIT BADGE":"NEW BADGE"}</div>
            
            <div style={{display:"flex",gap:10,marginBottom:12}}>
              <div style={{flex:1}}>
                <div style={{fontSize:11,color:T.muted,fontFamily:F.mono,letterSpacing:1,marginBottom:6}}>ICON</div>
                <input value={f.icon} onChange={e=>setF({...f,icon:e.target.value})} placeholder="🔥" style={{width:"100%",background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"11px 14px",color:T.text,fontSize:14,textAlign:"center"}}/>
              </div>
              <div style={{flex:4}}>
                <div style={{fontSize:11,color:T.muted,fontFamily:F.mono,letterSpacing:1,marginBottom:6}}>BADGE NAME</div>
                <input value={f.name} onChange={e=>setF({...f,name:e.target.value})} placeholder="e.g. Iron Discipline" style={{width:"100%",background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"11px 14px",color:T.text,fontSize:13}}/>
              </div>
            </div>

            <div style={{marginBottom:12}}>
              <div style={{fontSize:11,color:T.muted,fontFamily:F.mono,letterSpacing:1,marginBottom:6}}>DESCRIPTION</div>
              <input value={f.desc} onChange={e=>setF({...f,desc:e.target.value})} placeholder="Description seen by members..." style={{width:"100%",background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"11px 14px",color:T.text,fontSize:13}}/>
            </div>

            <div style={{background:T.cardHi,border:`1px solid ${T.borderHi}`,borderRadius:14,padding:16,marginBottom:18}}>
              <div style={{fontSize:12,color:accent,fontWeight:700,fontFamily:F.mono,letterSpacing:1,marginBottom:12}}>AWARD RULES</div>
              <div style={{display:"flex",gap:10}}>
                <div style={{flex:2}}>
                  <div style={{fontSize:10,color:T.muted,marginBottom:4}}>Trigger Type</div>
                  <select value={f.ruleType} onChange={e=>setF({...f,ruleType:e.target.value})} style={{width:"100%",background:T.card,border:`1px solid ${T.border}`,borderRadius:10,padding:"10px",color:T.text,fontSize:12,colorScheme:"dark"}}>
                    <option value="class_count">Total Classes Booked</option>
                    <option value="streak">Workout Streak (Days)</option>
                    <option value="months">Active Months</option>
                    <option value="purchase_count">Store Purchases</option>
                    <option value="branch_count">Branches Visited</option>
                  </select>
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:10,color:T.muted,marginBottom:4}}>Target</div>
                  <input type="number" value={f.targetValue} onChange={e=>setF({...f,targetValue:e.target.value})} style={{width:"100%",background:T.card,border:`1px solid ${T.border}`,borderRadius:10,padding:"10px",color:T.text,fontSize:12}}/>
                </div>
              </div>
            </div>

            <button onClick={handleSave} disabled={loading} style={{width:"100%",padding:14,borderRadius:12,fontFamily:F.display,fontSize:18,letterSpacing:2,background:accent,color:T.bg,fontWeight:700}}>{loading?"SAVING...":"SAVE BADGE"}</button>
          </>
        )}
        {view==="list"&&<button onClick={onClose} style={{width:"100%",padding:12,borderRadius:12,background:"transparent",color:T.muted,fontSize:14,fontWeight:600,border:`1px solid ${T.border}`,marginTop:16}}>CLOSE WINDOW</button>}
      </div>
    </Modal>
  );
}

function BroadcastModal({ broadcasts, onClose, onSend, accent }) {
  const [view, setView] = useState("list"); // Mode tampilan: 'list', 'new', 'detail'
  const [msg, setMsg] = useState("");
  const [search, setSearch] = useState("");
  const [selItem, setSelItem] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fitur Filter & Search
  const filtered = broadcasts.filter(b => b.text.toLowerCase().includes(search.toLowerCase()));

  const handleSend = async () => {
    if (!msg.trim()) return;
    setLoading(true);
    await onSend(msg);
    setLoading(false);
    setMsg("");
    setView("list"); // Kembali ke list setelah sukses kirim
  };

  return (
    <Modal onClose={onClose}>
      <div style={{ padding: "28px 24px 40px" }}>
        
        {/* TAMPILAN LIST BROADCAST */}
        {view === "list" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ fontFamily: F.display, fontSize: 26, color: T.text, letterSpacing: 2 }}>BROADCASTS</div>
              <button onClick={() => setView("new")} style={{ background: accent, color: T.bg, borderRadius: 12, padding: "6px 12px", fontFamily: F.display, fontSize: 14, letterSpacing: 1, fontWeight: 700 }}>+ NEW</button>
            </div>
            
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search broadcast messages..." style={{ width: "100%", background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: "11px 16px", color: T.text, fontSize: 13, marginBottom: 16 }} />
            
            {filtered.length === 0 ? <Empty icon="📢" title="NO BROADCASTS" sub="No announcements found" /> : 
              filtered.map((b, i) => (
                <div key={b.id} className="fu rp" onClick={() => { setSelItem(b); setView("detail"); }} style={{ animationDelay: `${i * .04}s`, background: T.card, borderRadius: 14, padding: 14, marginBottom: 10, border: `1px solid ${T.border}`, cursor: "pointer" }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: accent + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>📢</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, color: T.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontWeight:600 }}>{b.text}</div>
                      <div style={{ fontSize: 11, color: T.muted, marginTop: 4, fontFamily: F.mono }}>{b.date}</div>
                    </div>
                    <div style={{ color: T.dim, fontSize: 16 }}>›</div>
                  </div>
                </div>
              ))
            }
          </>
        )}

        {/* TAMPILAN DETAIL BROADCAST */}
        {view === "detail" && selItem && (
          <div className="su">
            <div onClick={() => setView("list")} style={{ display: "flex", alignItems: "center", gap: 8, color: T.muted, fontSize: 13, cursor: "pointer", marginBottom: 16, fontWeight: 600 }}>← Back to List</div>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 48, marginBottom: 8 }}>📢</div>
              <div style={{ fontSize: 11, color: accent, fontFamily: F.mono, letterSpacing: 2 }}>SENT ON {selItem.date.toUpperCase()}</div>
            </div>
            <div style={{ background: T.card, borderRadius: 16, padding: 20, border: `1px solid ${T.border}`, fontSize: 14, color: T.text, lineHeight: 1.6 }}>
              {selItem.text}
            </div>
          </div>
        )}

        {/* TAMPILAN FORM CREATE BROADCAST BARU */}
        {view === "new" && (
          <div className="su">
            <div onClick={() => setView("list")} style={{ display: "flex", alignItems: "center", gap: 8, color: T.muted, fontSize: 13, cursor: "pointer", marginBottom: 16, fontWeight: 600 }}>← Cancel</div>
            <div style={{ fontFamily: F.display, fontSize: 26, color: T.text, letterSpacing: 2, marginBottom: 8 }}>SEND BROADCAST</div>
            <div style={{ fontSize: 13, color: T.muted, marginBottom: 16 }}>This message will appear on all member home screens immediately.</div>
            
            <textarea value={msg} onChange={e => setMsg(e.target.value)} placeholder="Type your announcement here..." rows={5} style={{ width: "100%", background: T.card, border: `1px solid ${accent}`, borderRadius: 12, padding: "14px", color: T.text, fontSize: 14, resize: "none", marginBottom: 16, outline: "none" }} />
            
            <button onClick={handleSend} disabled={!msg.trim() || loading} style={{ width: "100%", padding: 14, borderRadius: 12, fontFamily: F.display, fontSize: 18, letterSpacing: 2, background: msg.trim() ? accent : T.border, color: msg.trim() ? T.bg : T.dim, fontWeight: 700 }}>
              {loading ? "SENDING..." : "SEND TO ALL MEMBERS"}
            </button>
          </div>
        )}
        
        <button onClick={onClose} style={{ width: "100%", padding: 12, borderRadius: 12, background: "transparent", color: T.muted, fontSize: 14, fontWeight: 600, border: `1px solid ${T.border}`, marginTop: 16 }}>CLOSE WINDOW</button>
      </div>
    </Modal>
  );
}

function AddClassModal({branches,trainers,onClose,onAdd,accent}){
  const [f,setF]=useState({name:"",trainerId:"T1",time:"",day:"Mon",duration:"60 min",total:15,category:"HIIT",icon:"🔥",color:"#FF3131",intensity:"HIGH",branchId:branches[0]?.id||"",isOnline:false,videoUrl:""});
  const s=(k,v)=>setF(p=>({...p,[k]:v}));
  return(
    <Modal onClose={onClose}>
      <div style={{padding:"26px 24px 40px"}}>
        <div style={{fontFamily:F.display,fontSize:24,color:T.text,letterSpacing:2,marginBottom:18}}>ADD CLASS</div>
        
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16,background:f.isOnline?T.blue+"22":T.cardHi,padding:12,borderRadius:12,border:`1px solid ${f.isOnline?T.blue+"66":T.border}`}}>
          <input type="checkbox" checked={f.isOnline} onChange={e=>s("isOnline",e.target.checked)} style={{width:18,height:18,accentColor:T.blue}}/>
          <span style={{fontSize:13,fontWeight:700,color:f.isOnline?T.text:T.muted}}>🌐 Set as Virtual / Online Class</span>
        </div>

        <div style={{marginBottom:12,opacity:f.isOnline?0.5:1,pointerEvents:f.isOnline?"none":"auto"}}>
          <div style={{fontSize:11,color:T.muted,fontFamily:F.mono,letterSpacing:2,marginBottom:6}}>BRANCH</div>
          <select value={f.branchId} onChange={e=>s("branchId",e.target.value)} style={{width:"100%",background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"11px 14px",color:T.text,fontSize:13,colorScheme:"dark"}}>
            {branches.map(b=><option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>

        {f.isOnline&&(
          <div style={{marginBottom:12}}>
            <div style={{fontSize:11,color:T.blue,fontFamily:F.mono,letterSpacing:2,marginBottom:6}}>VIDEO LINK (Zoom / Google Meet / YouTube)</div>
            <input value={f.videoUrl} onChange={e=>s("videoUrl",e.target.value)} placeholder="https://zoom.us/j/... or https://youtu.be/..."
              style={{width:"100%",background:T.card,border:`1px solid ${T.blue}66`,borderRadius:12,padding:"11px 14px",color:T.text,fontSize:13}}/>
            <div style={{fontSize:10,color:T.muted,marginTop:4}}>YouTube embed & Zoom links will be playable in-app by members who have paid.</div>
          </div>
        )}

        <div style={{marginBottom:12}}>
          <div style={{fontSize:11,color:T.muted,fontFamily:F.mono,letterSpacing:2,marginBottom:6}}>TRAINER</div>
          <select value={f.trainerId} onChange={e=>s("trainerId",e.target.value)} style={{width:"100%",background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"11px 14px",color:T.text,fontSize:13,colorScheme:"dark"}}>
            {trainers.filter(t=>f.isOnline||!f.branchId||t.branchId===f.branchId).map(t=><option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
        {[{k:"name",label:"Class Name",ph:"HIIT INFERNO"},{k:"time",label:"Time",ph:"06:00"},{k:"duration",label:"Duration",ph:"45 min"}].map(fi=>(
          <div key={fi.k} style={{marginBottom:12}}>
            <div style={{fontSize:11,color:T.muted,fontFamily:F.mono,letterSpacing:2,marginBottom:6}}>{fi.label.toUpperCase()}</div>
            <input value={f[fi.k]} onChange={e=>s(fi.k,e.target.value)} placeholder={fi.ph} style={{width:"100%",background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"11px 14px",color:T.text,fontSize:13}}/>
          </div>
        ))}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:18}}>
          <div>
            <div style={{fontSize:11,color:T.muted,fontFamily:F.mono,letterSpacing:2,marginBottom:6}}>DAY</div>
            <select value={f.day} onChange={e=>s("day",e.target.value)} style={{width:"100%",background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"11px 14px",color:T.text,fontSize:13,colorScheme:"dark"}}>
              {DAYS.map(d=><option key={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <div style={{fontSize:11,color:T.muted,fontFamily:F.mono,letterSpacing:2,marginBottom:6}}>CAPACITY</div>
            <input type="number" value={f.total} onChange={e=>s("total",parseInt(e.target.value)||15)} style={{width:"100%",background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"11px 14px",color:T.text,fontSize:13}}/>
          </div>
        </div>
        <button onClick={()=>f.name&&f.time&&onAdd({...f,branchId:f.isOnline?"ONLINE":f.branchId})} disabled={!f.name||!f.time} style={{width:"100%",padding:14,borderRadius:12,fontFamily:F.display,fontSize:17,letterSpacing:2,background:f.name&&f.time?accent:T.border,color:f.name&&f.time?T.bg:T.dim,fontWeight:700,marginBottom:8}}>SAVE CLASS</button>
        <button onClick={onClose} style={{width:"100%",padding:11,borderRadius:12,background:"transparent",color:T.muted,fontSize:13,fontWeight:600,border:`1px solid ${T.border}`}}>CANCEL</button>
      </div>
    </Modal>
  );
}

function AddMemberModal({branches, plans, onClose, onAdd, accent}){
  const [f,setF]=useState({name:"",email:"",plan:plans[0]?.name||"Monthly",avatar:"👤",branchId:branches[0]?.id||""});
  const s=(k,v)=>setF(p=>({...p,[k]:v}));
  
  return(
    <Modal onClose={onClose}>
      <div style={{padding:"26px 24px 40px"}}>
        <div style={{fontFamily:F.display,fontSize:24,color:T.text,letterSpacing:2,marginBottom:18}}>ADD MEMBER</div>
        <div style={{marginBottom:12}}>
          <div style={{fontSize:11,color:T.muted,fontFamily:F.mono,letterSpacing:2,marginBottom:6}}>BRANCH</div>
          <select value={f.branchId} onChange={e=>s("branchId",e.target.value)} style={{width:"100%",background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"11px 14px",color:T.text,fontSize:13,colorScheme:"dark"}}>
            {branches.map(b=><option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>
        {[{k:"name",label:"Full Name",ph:"John Doe"},{k:"email",label:"Email",ph:"john@email.com"}].map(fi=>(
          <div key={fi.k} style={{marginBottom:12}}>
            <div style={{fontSize:11,color:T.muted,fontFamily:F.mono,letterSpacing:2,marginBottom:6}}>{fi.label.toUpperCase()}</div>
            <input value={f[fi.k]} onChange={e=>s(fi.k,e.target.value)} placeholder={fi.ph} style={{width:"100%",background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"11px 14px",color:T.text,fontSize:13}}/>
          </div>
        ))}
        
        <div style={{marginBottom:18}}>
          <div style={{fontSize:11,color:T.muted,fontFamily:F.mono,letterSpacing:2,marginBottom:8}}>PLAN</div>
          <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
            {plans.map(p=>(
              <div key={p.id} className="rp" onClick={()=>s("plan",p.name)} style={{padding:"6px 13px",borderRadius:10,fontSize:11,fontWeight:700,background:f.plan===p.name?accent:"transparent",color:f.plan===p.name?T.bg:T.muted,border:`1px solid ${f.plan===p.name?accent:T.border}`,cursor:"pointer",transition:"all .2s"}}>{p.name}</div>
            ))}
          </div>
        </div>
        
        <button onClick={()=>f.name&&f.email&&onAdd(f)} disabled={!f.name||!f.email} style={{width:"100%",padding:14,borderRadius:12,fontFamily:F.display,fontSize:17,letterSpacing:2,background:f.name&&f.email?accent:T.border,color:f.name&&f.email?T.bg:T.dim,fontWeight:700,marginBottom:8}}>REGISTER MEMBER</button>
        <button onClick={onClose} style={{width:"100%",padding:11,borderRadius:12,background:"transparent",color:T.muted,fontSize:13,fontWeight:600,border:`1px solid ${T.border}`}}>CANCEL</button>
      </div>
    </Modal>
  );
}

function BranchTransferModal({currentBranchId,branches,pendingTransfer,onSubmit,onClose}){
  const [selBranch,setSelBranch]=useState("");
  const [reason,setReason]=useState("");
  const otherBranches=branches.filter(b=>b.id!==currentBranchId);
  return(
    <Modal onClose={onClose}>
      <div style={{padding:"28px 24px 40px"}}>
        <div style={{fontFamily:F.display,fontSize:26,color:T.text,letterSpacing:2,marginBottom:4}}>TRANSFER BRANCH</div>
        <div style={{fontSize:13,color:T.muted,marginBottom:20}}>Request will be reviewed by Super Admin</div>
        {pendingTransfer?(
          <div style={{background:"#FFD70018",border:"1px solid #FFD70044",borderRadius:14,padding:16,textAlign:"center"}}>
            <div style={{fontSize:28,marginBottom:8}}>⏳</div>
            <div style={{fontFamily:F.display,fontSize:20,color:T.yellow,letterSpacing:1,marginBottom:4}}>PROCESSING</div>
            <div style={{fontSize:13,color:T.muted}}>Transfer to {branches.find(b=>b.id===pendingTransfer.toBranchId)?.name} is awaiting admin approval.</div>
          </div>
        ):(
          <>
            <div style={{marginBottom:16}}>
              <div style={{fontSize:11,color:T.muted,fontFamily:F.mono,letterSpacing:2,marginBottom:10}}>SELECT TARGET BRANCH</div>
              {otherBranches.map(b=>(
                <div key={b.id} className="rp" onClick={()=>setSelBranch(b.id)} style={{background:selBranch===b.id?b.color+"22":T.card,border:`1.5px solid ${selBranch===b.id?b.color:T.border}`,borderRadius:14,padding:"12px 14px",marginBottom:8,cursor:"pointer",display:"flex",gap:12,alignItems:"center",transition:"all .2s"}}>
                  <span style={{fontSize:22}}>{b.cover}</span>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:700,color:T.text,fontSize:14}}>{b.name}</div>
                    <div style={{fontSize:11,color:T.muted}}>{b.area} · {b.hours}</div>
                  </div>
                  {selBranch===b.id&&<div style={{width:22,height:22,borderRadius:"50%",background:b.color,display:"flex",alignItems:"center",justifyContent:"center",color:T.bg,fontSize:12,fontWeight:700}}>✓</div>}
                </div>
              ))}
            </div>
            <div style={{marginBottom:20}}>
              <div style={{fontSize:11,color:T.muted,fontFamily:F.mono,letterSpacing:2,marginBottom:6}}>REASON FOR TRANSFER</div>
              <textarea value={reason} onChange={e=>setReason(e.target.value)} placeholder="e.g. Moved to a new workplace..." rows={3} style={{width:"100%",background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"12px 14px",color:T.text,fontSize:13,resize:"none"}}/>
            </div>
            <button onClick={()=>selBranch&&reason&&onSubmit(selBranch,reason)} disabled={!selBranch||!reason} style={{width:"100%",padding:14,borderRadius:12,fontFamily:F.display,fontSize:18,letterSpacing:2,background:selBranch&&reason?T.cyan:T.border,color:selBranch&&reason?T.bg:T.dim,fontWeight:700}}>SUBMIT REQUEST</button>
          </>
        )}
        <button onClick={onClose} style={{width:"100%",padding:12,borderRadius:12,background:"transparent",color:T.muted,fontSize:14,fontWeight:600,border:`1px solid ${T.border}`,marginTop:8}}>CLOSE</button>
      </div>
    </Modal>
  );
}

function FitnessProgressModal({progress, onAdd, onClose, accent}) {
  const [weight, setWeight] = useState("");
  const [note, setNote] = useState("");
  return (
    <Modal onClose={onClose}>
      <div style={{padding:"28px 24px 40px"}}>
        <div style={{fontFamily:F.display,fontSize:26,color:T.text,letterSpacing:2,marginBottom:16}}>FITNESS PROGRESS</div>
        <div style={{background:T.card, border:`1px solid ${T.border}`, borderRadius:14, padding:16, marginBottom:20}}>
          <div style={{fontSize:11, color:T.muted, fontFamily:F.mono, marginBottom:8}}>ADD NEW RECORD</div>
          <div style={{display:"flex", gap:10}}>
            <input type="number" value={weight} onChange={e=>setWeight(e.target.value)} placeholder="Kg" style={{flex:1, background:T.bg, border:`1px solid ${T.border}`, borderRadius:10, padding:"10px", color:T.text}}/>
            <input type="text" value={note} onChange={e=>setNote(e.target.value)} placeholder="Note..." style={{flex:2, background:T.bg, border:`1px solid ${T.border}`, borderRadius:10, padding:"10px", color:T.text}}/>
          </div>
          <button onClick={()=>{if(weight) {onAdd(weight,note); setWeight(""); setNote("");}}} style={{width:"100%", padding:"10px", background:accent, color:T.bg, fontWeight:700, borderRadius:10, marginTop:10}}>SAVE RECORD</button>
        </div>
        {progress.length === 0 ? <Empty icon="📈" title="NO RECORDS" sub="Start tracking your weight today!" /> : 
          progress.map((p) => (
            <div key={p.id} style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0", borderBottom: `1px solid ${T.border}`}}>
              <div>
                <div style={{fontWeight:700, color:T.text}}>{p.weight} kg</div>
                <div style={{fontSize:11, color:T.muted}}>{p.note || "No note"}</div>
              </div>
              <div style={{fontSize:11, fontFamily:F.mono, color:T.muted}}>{p.date}</div>
            </div>
          ))
        }
        <button onClick={onClose} style={{width:"100%",padding:12,borderRadius:12,background:"transparent",color:T.muted,fontSize:14,fontWeight:600,border:`1px solid ${T.border}`,marginTop:16}}>CLOSE</button>
      </div>
    </Modal>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MANAGE BRANCHES (SUPER ADMIN ONLY)
═══════════════════════════════════════════════════════════════ */
function AdminBranches({branches, setBranches, accent, setSyncQueue}){
  const [modal, setModal] = useState(null); // 'add' atau object branch

  const handleSave = async (b) => {
    const isNew = !b.id;
    const tempId = isNew ? "BR_" + Date.now() : b.id;
    const payload = { ...b, id: tempId };

    // Optimistic UI Update
    if(isNew) setBranches(prev => [...prev, payload]);
    else setBranches(prev => prev.map(x => x.id === payload.id ? payload : x));
    
    setModal(null);

    // API Call
    try {
      const res = await fetch(API_URL + (isNew ? '/admin/branches' : `/admin/branches/${payload.id}`), {
        method: isNew ? 'POST' : 'PUT',
        headers: API_HEADERS,
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if(isNew && res.ok) {
        // Replace tempId with Database ID if needed
        setBranches(prev => prev.map(x => x.id === tempId ? data.data : x));
      }
    } catch(e) {
      alert("Offline: Saved locally.");
    }
  };

  const handleToggle = async (id) => {
    setBranches(prev => prev.map(b => {
      if (b.id === id) {
        // 🟢 Amankan jika status null
        const currentStatus = b.status || 'active';
        return {...b, status: currentStatus === 'active' ? 'inactive' : 'active'};
      }
      return b;
    }));
    
    try {
      await fetch(API_URL + `/admin/branches/${id}/toggle`, { method: 'POST', headers: API_HEADERS });
    } catch(e) {}
  };

  return(
    <div style={{padding:"52px 20px 0"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:16}}>
        <div><RoleBadge role="admin" small/><SecTitle title="GYM BRANCHES" size={24}/></div>
        <button onClick={()=>setModal({name:"", short:"", address:"", area:"", phone:"", hours:"06:00-22:00", cover:"🏢", color:"#FFFFFF", tags:[], facilities:[], status:"active"})} style={{background:accent,color:T.bg,borderRadius:12,padding:"9px 16px",fontFamily:F.display,fontSize:13,letterSpacing:1,fontWeight:700}}>+ ADD NEW</button>
      </div>

      {modal && <BranchFormModal branch={modal} onSave={handleSave} onClose={()=>setModal(null)} accent={accent} />}

      {branches.map((b,i) => {
        // 🟢 PERBAIKAN: Beri nilai default 'active' jika b.status tidak ada di database/array lama
        const st = b.status || 'active'; 

        return (
          <div key={b.id} className="fu" style={{animationDelay:`${i*.05}s`, background:T.card, borderRadius:16, padding:16, marginBottom:12, border:`1px solid ${st==='inactive'?"#FF313144":T.border}`, opacity:st==='inactive'?0.6:1}}>
            <div style={{display:"flex", gap:14, alignItems:"center"}}>
              <div style={{width:50, height:50, borderRadius:14, background:b.color+"22", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, border:`1px solid ${b.color}44`}}>{b.cover}</div>
              <div style={{flex:1}}>
                <div style={{fontFamily:F.display, fontSize:18, color:T.text, letterSpacing:1}}>{b.name}</div>
                <div style={{fontSize:11, color:T.muted, marginTop:2}}>{b.address}</div>
                <div style={{display:"flex", gap:6, marginTop:6}}>
                  <span style={{fontSize:10, background:T.surface, border:`1px solid ${T.borderHi}`, padding:"2px 8px", borderRadius:10, fontFamily:F.mono, color:accent}}>ID: {b.id}</span>
                  <span onClick={()=>handleToggle(b.id)} style={{fontSize:10, cursor:"pointer", background:st==='active'?T.green+"22":"#FF313122", color:st==='active'?T.green:T.red, border:`1px solid ${st==='active'?T.green+"44":"#FF313144"}`, padding:"2px 8px", borderRadius:10, fontWeight:700}}>
                    {st.toUpperCase()}
                  </span>
                </div>
              </div>
              <div onClick={()=>setModal(b)} className="rp" style={{background:T.surface, border:`1px solid ${T.borderHi}`, color:T.text, padding:"8px 14px", borderRadius:12, fontSize:12, fontWeight:700, cursor:"pointer"}}>EDIT</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function BranchFormModal({branch, onSave, onClose, accent}) {
  // 🟢 Load fasilitas dan tags sebagai String (dipisah koma) agar mudah diedit di form
  const [f, setF] = useState({
    ...branch,
    facilitiesStr: (branch.facilities || []).join(", "),
    tagsStr: (branch.tags || []).join(", ")
  });
  const s = (k, v) => setF(p => ({ ...p, [k]: v }));

  const handlePreSave = () => {
    // 🟢 Pecah kembali string koma menjadi Array sebelum dilempar ke fungsi Save
    const finalData = {
      ...f,
      facilities: f.facilitiesStr.split(",").map(i => i.trim()).filter(Boolean),
      tags: f.tagsStr.split(",").map(i => i.trim()).filter(Boolean)
    };
    
    // Hapus variabel string bantuan agar tidak ikut terkirim ke Laravel
    delete finalData.facilitiesStr;
    delete finalData.tagsStr;
    
    onSave(finalData);
  };

  return (
    <Modal onClose={onClose}>
      <div style={{padding:"26px 24px 40px"}}>
        <div style={{fontFamily:F.display, fontSize:24, color:T.text, letterSpacing:2, marginBottom:16}}>{f.id ? "EDIT BRANCH" : "ADD NEW BRANCH"}</div>
        
        {/* BARIS 1: Emoji, Nama, Short */}
        <div style={{display:"flex", gap:10, marginBottom:12}}>
          <div style={{flex:1}}>
            <div style={{fontSize:11, color:T.muted, fontFamily:F.mono, marginBottom:6}}>EMOJI</div>
            <input value={f.cover} onChange={e=>s("cover",e.target.value)} style={{width:"100%", background:T.card, border:`1px solid ${T.border}`, borderRadius:12, padding:"11px", color:T.text, fontSize:14, textAlign:"center"}} />
          </div>
          <div style={{flex:3}}>
            <div style={{fontSize:11, color:T.muted, fontFamily:F.mono, marginBottom:6}}>FULL NAME</div>
            <input value={f.name} onChange={e=>s("name",e.target.value)} placeholder="RAW Seminyak" style={{width:"100%", background:T.card, border:`1px solid ${T.border}`, borderRadius:12, padding:"11px 14px", color:T.text, fontSize:13}} />
          </div>
          <div style={{flex:2}}>
            <div style={{fontSize:11, color:T.muted, fontFamily:F.mono, marginBottom:6}}>SHORT</div>
            <input value={f.short} onChange={e=>s("short",e.target.value)} placeholder="Seminyak" style={{width:"100%", background:T.card, border:`1px solid ${T.border}`, borderRadius:12, padding:"11px 14px", color:T.text, fontSize:13}} />
          </div>
        </div>

        {/* 🟢 BARIS 2: Area (Region) & Phone */}
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:12}}>
          <div>
            <div style={{fontSize:11, color:T.muted, fontFamily:F.mono, marginBottom:6}}>AREA (Region)</div>
            <input value={f.area} onChange={e=>s("area",e.target.value)} placeholder="e.g. South Kuta" style={{width:"100%", background:T.card, border:`1px solid ${T.border}`, borderRadius:12, padding:"11px 14px", color:T.text, fontSize:13}} />
          </div>
          <div>
            <div style={{fontSize:11, color:T.muted, fontFamily:F.mono, marginBottom:6}}>PHONE</div>
            <input value={f.phone} onChange={e=>s("phone",e.target.value)} placeholder="0361..." style={{width:"100%", background:T.card, border:`1px solid ${T.border}`, borderRadius:12, padding:"11px 14px", color:T.text, fontSize:13}} />
          </div>
        </div>

        {/* BARIS 3: Address & Color */}
        <div style={{display:"grid", gridTemplateColumns:"80px 1fr", gap:10, marginBottom:12}}>
          <div>
            <div style={{fontSize:11, color:T.muted, fontFamily:F.mono, marginBottom:6}}>COLOR</div>
            <input type="color" value={f.color} onChange={e=>s("color",e.target.value)} style={{width:"100%", height:40, background:T.card, border:`1px solid ${T.border}`, borderRadius:12, cursor:"pointer"}} />
          </div>
          <div>
            <div style={{fontSize:11, color:T.muted, fontFamily:F.mono, marginBottom:6}}>ADDRESS</div>
            <input value={f.address} onChange={e=>s("address",e.target.value)} style={{width:"100%", background:T.card, border:`1px solid ${T.border}`, borderRadius:12, padding:"11px 14px", color:T.text, fontSize:13}} />
          </div>
        </div>

        {/* 🟢 BARIS 4: Facilities & Tags */}
        <div style={{marginBottom:12}}>
          <div style={{fontSize:11, color:T.muted, fontFamily:F.mono, marginBottom:6}}>FACILITIES (Dipisah koma)</div>
          <textarea value={f.facilitiesStr} onChange={e=>s("facilitiesStr",e.target.value)} rows={2} placeholder="Sauna, Crossfit, Café..." style={{width:"100%", background:T.card, border:`1px solid ${T.border}`, borderRadius:12, padding:"11px 14px", color:T.text, fontSize:13, resize:"none", outline:"none"}} />
        </div>

        <div style={{marginBottom:18}}>
          <div style={{fontSize:11, color:T.muted, fontFamily:F.mono, marginBottom:6}}>TAGS (Dipisah koma)</div>
          <input value={f.tagsStr} onChange={e=>s("tagsStr",e.target.value)} placeholder="PREMIUM, 24/7..." style={{width:"100%", background:T.card, border:`1px solid ${T.border}`, borderRadius:12, padding:"11px 14px", color:T.text, fontSize:13, outline:"none"}} />
        </div>

        <button onClick={handlePreSave} disabled={!f.name} style={{width:"100%", padding:14, borderRadius:12, fontFamily:F.display, fontSize:17, letterSpacing:2, background:f.name?accent:T.border, color:f.name?T.bg:T.dim, fontWeight:700, marginBottom:8}}>SAVE BRANCH</button>
        <button onClick={onClose} style={{width:"100%", padding:11, borderRadius:12, background:"transparent", color:T.muted, fontSize:13, fontWeight:600, border:`1px solid ${T.border}`}}>CANCEL</button>
      </div>
    </Modal>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PRODUCT MODAL (ADD/EDIT INVENTORY)
═══════════════════════════════════════════════════════════════ */
function ProductModal({ product, onClose, onSave, accent }) {
  const [f, setF] = useState(product || { name: "", price: "", cost: "", stock: 10, icon: "📦", category: "Merchandise", description: "", images: [] });
  const s = (k, v) => setF(p => ({ ...p, [k]: v }));
  const cats = ["Merchandise", "Supplements", "Equipment", "Events", "F&B"];

  const handleSave = () => {
    if(!f.name || !f.price || !f.cost) return alert("Lengkapi nama, harga jual, dan modal dasar!");
    onSave({...f, price: parseInt(f.price)||0, cost: parseInt(f.cost)||0, stock: parseInt(f.stock)||0});
  };

  return (
    <Modal onClose={onClose}>
      <div style={{ padding: "26px 24px 40px" }}>
        <div style={{ fontFamily: F.display, fontSize: 24, color: T.text, letterSpacing: 2, marginBottom: 18 }}>
          {product ? "EDIT ITEM" : "ADD NEW ITEM"}
        </div>

        <div style={{display:"flex", gap:10, marginBottom:12}}>
          <div style={{flex:1}}>
            <div style={{fontSize:11,color:T.muted,fontFamily:F.mono,letterSpacing:1,marginBottom:6}}>ICON</div>
            <input value={f.icon} onChange={e=>s("icon",e.target.value)} placeholder="📦" style={{width:"100%",background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"11px 14px",color:T.text,fontSize:14,textAlign:"center"}}/>
          </div>
          <div style={{flex:4}}>
            <div style={{fontSize:11,color:T.muted,fontFamily:F.mono,letterSpacing:1,marginBottom:6}}>ITEM NAME</div>
            <input value={f.name} onChange={e=>s("name",e.target.value)} placeholder="e.g. RAW Lifting Belt" style={{width:"100%",background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"11px 14px",color:T.text,fontSize:13}}/>
          </div>
        </div>

        <div style={{display:"flex", gap:10, marginBottom:12}}>
          <div style={{flex:1}}>
            <div style={{fontSize:11,color:T.muted,fontFamily:F.mono,letterSpacing:1,marginBottom:6}}>PRICE (RP)</div>
            <input type="number" value={f.price} onChange={e=>s("price",e.target.value)} placeholder="150000" style={{width:"100%",background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"11px 14px",color:T.text,fontSize:13}}/>
          </div>
          <div style={{flex:1}}>
            <div style={{fontSize:11,color:T.muted,fontFamily:F.mono,letterSpacing:1,marginBottom:6}}>COST (RP)</div>
            <input type="number" value={f.cost} onChange={e=>s("cost",e.target.value)} placeholder="80000" style={{width:"100%",background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"11px 14px",color:T.text,fontSize:13}}/>
          </div>
          {!product && (
            <div style={{flex:1}}>
              <div style={{fontSize:11,color:T.muted,fontFamily:F.mono,letterSpacing:1,marginBottom:6}}>STOCK</div>
              <input type="number" value={f.stock} onChange={e=>s("stock",e.target.value)} placeholder="10" style={{width:"100%",background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"11px 14px",color:T.text,fontSize:13}}/>
            </div>
          )}
        </div>

        <div style={{marginBottom:12}}>
          <div style={{fontSize:11,color:T.muted,fontFamily:F.mono,letterSpacing:1,marginBottom:6}}>CATEGORY</div>
          <select value={f.category} onChange={e=>s("category",e.target.value)} style={{width:"100%",background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"11px 14px",color:T.text,fontSize:13,colorScheme:"dark",outline:"none"}}>
            {cats.map(c=><option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div style={{marginBottom:18}}>
          <div style={{fontSize:11,color:T.muted,fontFamily:F.mono,letterSpacing:1,marginBottom:6}}>DESCRIPTION</div>
          <textarea value={f.description} onChange={e=>s("description",e.target.value)} rows={3} placeholder="Item details..." style={{width:"100%",background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"11px 14px",color:T.text,fontSize:13,resize:"none",outline:"none"}}/>
        </div>

        <button onClick={handleSave} style={{width:"100%",padding:14,borderRadius:12,fontFamily:F.display,fontSize:17,letterSpacing:2,background:accent,color:T.bg,fontWeight:700,marginBottom:8}}>SAVE ITEM</button>
        <button onClick={onClose} style={{width:"100%",padding:11,borderRadius:12,background:"transparent",color:T.muted,fontSize:13,fontWeight:600,border:`1px solid ${T.border}`}}>CANCEL</button>
      </div>
    </Modal>
  );
}

/* ═══════════════════════════════════════════════════════════════
   REVIEW
═══════════════════════════════════════════════════════════════ */
function ReviewModal({booking, onClose, onSubmit, accent}) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  return (
    <Modal onClose={onClose}>
      <div style={{padding:"28px 24px 40px", textAlign:"center"}}>
        <div style={{fontSize:40, marginBottom:10}}>⭐</div>
        <div style={{fontFamily:F.display,fontSize:24,color:T.text,letterSpacing:2}}>RATE YOUR SESSION</div>
        <div style={{fontSize:13,color:T.muted,marginBottom:20}}>How was your class with {booking.trainer}?</div>
        
        <div style={{display:"flex", justifyContent:"center", gap:10, marginBottom:20}}>
          {[1,2,3,4,5].map(num => (
            <div key={num} onClick={() => setRating(num)} style={{fontSize:30, cursor:"pointer", filter: rating >= num ? "none" : "grayscale(1) opacity(0.3)"}}>⭐</div>
          ))}
        </div>

        <textarea value={comment} onChange={e=>setComment(e.target.value)} placeholder="Optional: Add a comment..." rows={3} style={{width:"100%",background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"12px",color:T.text,fontSize:13,resize:"none",marginBottom:20}}/>

        <button onClick={() => onSubmit({rating, comment})} style={{width:"100%",padding:14,borderRadius:12,fontFamily:F.display,fontSize:18,letterSpacing:2,background:accent,color:T.bg,fontWeight:700}}>SUBMIT REVIEW</button>
      </div>
    </Modal>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TRAINER APP
═══════════════════════════════════════════════════════════════ */
function TrainerApp({user,updateUser,updateTrainer,branches,classes,bookings,setBookings,transfers,setTransfers,products,processPurchase,broadcasts,fitnessProgress,setFitnessProgress,securityLog,addSecurityEvent,supportTickets,setSupportTickets,sendReply,onLogout,badges,notifications,setNotifications,reviews,setReviews,trainers,users,trainerLogs,setTrainerLogs,getTrainerStats,clientNotes,setClientNotes,plans}){
  const [tab,setTab]=useState("today");
  const [attendance,setAttendance]=useState({});
  const [recapModal,setRecapModal]=useState(false);
  const [editProfileModal,setEditProfileModal]=useState(false);
  const [notifModal, setNotifModal] = useState(false);

  const accent=T.lime;
  const trainer=trainers.find(t=>t.id===user.trainerId) || trainers[0];
  const myBranch=branches.find(b=>b.id===trainer?.branchId);
  const mySched=classes.filter(c=>c.trainerId===trainer?.id);

  // 🟢 PERBAIKAN: Arahkan ke tab Schedule saat notifikasi kelas baru diklik
  const handleNotifClick = (type) => {
    setNotifModal(false);
    if(type === 'class') setTab("schedule");
  };

  return(
    <div>
      {notifModal&&<NotificationModal notifications={notifications} setNotifications={setNotifications} onClose={()=>setNotifModal(false)} onNavigate={handleNotifClick} accent={accent}/>}
      {recapModal&&<TrainerRecapModal logs={trainerLogs[trainer?.id]} onClose={()=>setRecapModal(false)} accent={accent}/>}
      {editProfileModal&&<SelfEditProfileModal user={user} trainer={trainer} role="trainer" updateUser={updateTrainer} securityLog={securityLog} addSecurityEvent={addSecurityEvent} onClose={()=>setEditProfileModal(false)} accent={accent} plans={plans}/>}
     <div style={{paddingBottom:90}}>
       {tab==="today"   &&<TrainerToday trainer={trainer} myBranch={myBranch} sched={mySched} attendance={attendance} setAttendance={setAttendance} logs={trainerLogs} setLogs={setTrainerLogs} accent={accent} bookings={bookings} setBookings={setBookings} users={users} notifications={notifications} onOpenNotif={()=>setNotifModal(true)} getTrainerStats={getTrainerStats}/>}
        {tab==="schedule"&&<TrainerSchedule trainer={trainer} myBranch={myBranch} sched={mySched} accent={accent} bookings={bookings} setBookings={setBookings} users={users}/>}
        {tab==="clients" &&<TrainerClients accent={accent} trainer={trainer} clientNotes={clientNotes} setClientNotes={setClientNotes} bookings={bookings} users={users}/>}
        {tab==="profile" &&<TrainerProfile user={user} trainer={trainer} myBranch={myBranch} sched={mySched} bookings={bookings} onOpenRecap={()=>setRecapModal(true)} onEditProfile={()=>setEditProfileModal(true)} onLogout={onLogout} accent={accent} getTrainerStats={getTrainerStats}/>}
      </div>
      <BNav items={[{id:"today",icon:"⚡",label:"Today"},{id:"schedule",icon:"📅",label:"Schedule"},{id:"clients",icon:"👥",label:"Clients"},{id:"profile",icon:"🏋️",label:"Profile"}]} active={tab} onChange={setTab} accent={accent}/>
    </div>
  );
}

function TrainerToday({trainer,myBranch,sched,attendance,setAttendance,logs,setLogs,accent,bookings,setBookings,users,notifications,onOpenNotif,getTrainerStats}){
  const todayObj = DYNAMIC_DAYS[0]; 
  const todayClass = sched.filter(c => c.day === todayObj.dayName);
  const todayPrivates = bookings.filter(b => b.type === "private" && b.trainer === trainer.name && b.paymentStatus === "verified" && b.date === todayObj.fullDate);

  const toggleA = async (transactionId) => {
    try {
      const res = await fetch(`${API_URL}/trainer/attendance/${transactionId}`, { method: 'POST' });
      const data = await res.json();
      if(res.ok) {
        setBookings(prev => prev.map(b => b.id === transactionId ? {...b, isAttended: data.is_attended} : b));
      }
    } catch { alert("Failed to update attendance"); }
  };
  
  // Ambil log yang sudah diformat dengan benar
  const trLog = logs[trainer.id] || { status: "inactive", history: [], lastAction: null };
  const isWorking = trLog.status === "active";

  const toggleWork = async () => {
    const type = isWorking ? "END" : "START";
    try {
      const res = await fetch(`${API_URL}/trainer/shift`, {
        method: 'POST',
        headers: API_HEADERS,
        // Kirim ID asli trainer sesuai yang dibaca React
        body: JSON.stringify({ trainer_id: trainer.id, type }) 
      });
      const data = await res.json();
      if(res.ok) {
        // Ambil waktu dari server, bersihkan formatnya
        const serverTimeRaw = data.data?.time || new Date().toISOString();
        const serverTimeStr = String(serverTimeRaw).replace(/-/g, "/").replace(/\.\d+/, "");
        const newActionTime = new Date(serverTimeStr);

        setLogs(prev => ({
          ...prev,
          [trainer.id]: {
            status: type === "START" ? "active" : "inactive",
            lastAction: newActionTime,
            history: [...(prev[trainer.id]?.history || []), { type, time: serverTimeStr }]
          }
        }));
      }
    } catch { alert("Server error updating shift"); }
  };

  // Format jam dengan pengaman
  const formatTime = (dateObj) => {
    if (!dateObj || isNaN(dateObj.getTime())) return "--:--";
    return dateObj.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
  };

  return(
    <div style={{padding:"52px 20px 0"}}>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start"}}>
        <div>
          <RoleBadge role="trainer"/>
          <div style={{fontFamily:F.display,fontSize:28,color:T.text,letterSpacing:2,lineHeight:1,marginTop:8}}>{trainer.name.toUpperCase()}</div>
        </div>
        {/* 👈 TOMBOL NOTIFIKASI */}
        <div onClick={onOpenNotif} style={{position:"relative", background:T.card, padding:10, borderRadius:12, border:`1px solid ${T.border}`, cursor:"pointer"}}>
          <span style={{fontSize:20}}>🔔</span>
          {notifications.filter(n => !n.is_read).length > 0 && (
            <div style={{position:"absolute", top:-5, right:-5, background:T.red, color:"#fff", fontSize:9, fontWeight:700, padding:"2px 6px", borderRadius:10}}>
              {notifications.filter(n => !n.is_read).length}
            </div>
          )}
        </div>
      </div>
      
      <div style={{fontSize:13,color:T.muted,marginTop:4}}>{trainer.specialty}</div>
      
      {myBranch&&<div style={{display:"inline-flex",alignItems:"center",gap:6,background:myBranch.color+"18",border:`1px solid ${myBranch.color}44`,borderRadius:20,padding:"4px 12px",marginTop:10}}>
        <span style={{fontSize:12}}>{myBranch.cover}</span>
        <span style={{fontSize:11,fontWeight:700,color:myBranch.color,fontFamily:F.mono}}>{myBranch.short}</span>
      </div>}

      {/* TAMPILAN SHIFT DINAMIS */}
      <div style={{background:T.card,borderRadius:16,padding:20,marginTop:16,marginBottom:18,border:`1px solid ${T.border}`,textAlign:"center"}}>
        <div style={{fontSize:40,marginBottom:10}}>{isWorking?"👊":"😴"}</div>
        <div style={{fontFamily:F.display,fontSize:22,letterSpacing:1,color:isWorking?accent:T.text}}>{isWorking?"CURRENTLY ON DUTY":"YOU ARE OFF-DUTY"}</div>
        
        {/* Waktu shift dimunculkan secara dinamis dan aman */}
        <div style={{fontSize:12,color:T.muted,marginBottom:16}}>
          {isWorking ? `Shift started at ${formatTime(trLog.lastAction)}` : "Ready to crush the session?"}
        </div>
        
        <button onClick={toggleWork} style={{width:"100%",padding:12,borderRadius:12,fontFamily:F.display,fontSize:18,letterSpacing:1,background:isWorking?T.red:accent,color:isWorking?"#fff":T.bg,fontWeight:700}}>{isWorking?"END SHIFT":"START WORK"}</button>
      </div>

      <div style={{display:"flex",gap:10,marginBottom:20}}>
        {/* 👈 PERBAIKAN RATING DINAMIS */}
        {[{l:"Wkly Sessions",v:sched.length,i:"📅",c:accent},{l:"Total Clients",v:sched.reduce((s,c)=>s+(c.total-c.slots),0),i:"👥",c:T.cyan},{l:"Rating",v:getTrainerStats(trainer.id).avg,i:"⭐",c:T.yellow}].map((s,i)=>(
          <div key={i} style={{flex:1,background:T.card,borderRadius:14,padding:"12px 8px",border:`1px solid ${T.border}`,textAlign:"center"}}>
            <div style={{fontSize:18,marginBottom:3}}>{s.i}</div>
            <div style={{fontFamily:F.display,fontSize:20,color:s.c,letterSpacing:1}}>{s.v}</div>
            <div style={{fontSize:10,color:T.muted,lineHeight:1.2}}>{s.l}</div>
          </div>
        ))}
      </div>
      
      <SecTitle title="TODAY'S SESSIONS"/>
      {todayPrivates.map((priv, i) => {
        const u = users.find(x => x.id === priv.userId);
        const uName = u ? u.name : priv.userId;
        return (
        <div key={priv.id} className="fu" style={{animationDelay:`${i*.06}s`,background:`linear-gradient(135deg, ${T.purple}22, ${T.card})`,borderRadius:18,padding:16,marginBottom:12,border:`1px solid ${T.purple}44`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
            <div>
              <div style={{fontFamily:F.display,fontSize:20,color:T.text,letterSpacing:1.5}}>PRIVATE SESSION 🎯</div>
              <div style={{fontSize:12,color:T.muted}}>{priv.time} · 60 min</div>
              <div style={{fontSize:12,color:T.purple,marginTop:4}}>{priv.description}</div>
            </div>
            <div style={{padding:"4px 10px",borderRadius:20,fontSize:10,fontWeight:700,fontFamily:F.mono,background:T.purple+"22",color:T.purple,border:`1px solid ${T.purple}44`}}>1-ON-1</div>
          </div>
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
            <div style={{fontSize:11,color:T.muted}}>Client: <b style={{color:T.text}}>{uName}</b></div>
            <button onClick={() => toggleA(priv.id)} style={{padding:"6px 12px", borderRadius:8, background:priv.isAttended?T.purple:T.bg, color:priv.isAttended?"#fff":T.purple, border:`1px solid ${T.purple}`, fontSize:11, fontWeight:700, cursor:"pointer"}}>
              {priv.isAttended ? "✓ ATTENDED" : "MARK ATTENDANCE"}
            </button>
          </div>
        </div>
        )
      })}

      {todayClass.map((cls) => {
        const enrolledMembers = bookings.filter(b => b.classId === cls.id && b.date === todayObj.fullDate && b.paymentStatus === "verified");
        return (
          <div key={cls.id} style={{background:T.card, borderRadius:18, padding:16, marginBottom:12, border:`1px solid ${T.border}`}}>
            <div style={{fontFamily:F.display, fontSize:20}}>{cls.name}</div>
            <div style={{fontSize:12, color:T.muted, marginBottom:12}}>{cls.time} · {enrolledMembers.length} Enrolled</div>
            <div style={{display:"flex", gap:8, flexWrap:"wrap"}}>
              {enrolledMembers.map(m => {
                const u = users.find(x => x.id === m.userId);
                const uName = u ? u.name : m.userId;
                return (
                  <div key={m.id} onClick={() => toggleA(m.id)} className="rp" style={{
                    padding:"8px 12px", borderRadius:10, background: m.isAttended ? accent+"22" : T.bg, 
                    border:`1px solid ${m.isAttended ? accent : T.borderHi}`, cursor:"pointer", display:"flex", alignItems:"center", gap:6
                  }}>
                    <span style={{fontSize:11, fontWeight:700, color: m.isAttended ? accent : T.muted}}>{uName}</span>
                    <span>{m.isAttended ? "✅" : "👤"}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
      <div style={{height:20}}/>
    </div>
  );
}

function TrainerSchedule({trainer,myBranch,sched,accent,bookings,setBookings,users}){
  const [selDate,setSelDate]=useState(DYNAMIC_DAYS[0]);
  const daySess=sched.filter(c=>c.day===selDate.dayName);
  const todayPrivates = bookings.filter(b => b.type === "private" && b.trainer === trainer.name && b.paymentStatus === "verified" && b.date === selDate.fullDate);
  
  // Fungsi Hit API Absensi
  const toggleA = async (transactionId) => {
    try {
      const res = await fetch(`${API_URL}/trainer/attendance/${transactionId}`, { method: 'POST' });
      const data = await res.json();
      if(res.ok) {
        setBookings(prev => prev.map(b => b.id === transactionId ? {...b, isAttended: data.is_attended} : b));
      }
    } catch { alert("Failed to update attendance"); }
  };

  return(
    <div style={{padding:"52px 20px 0"}}>
      <RoleBadge role="trainer" small/>
      <SecTitle title="MY SCHEDULE" size={28}/>
      {myBranch&&<div style={{fontSize:12,color:myBranch.color,marginBottom:8}}>{myBranch.cover} {myBranch.name}</div>}
      <DaySel selDate={selDate} setSelDate={setSelDate} accent={accent}/>
      <div style={{marginTop:12}}>
        
        {/* RENDER KELAS PRIVATE */}
        {todayPrivates.map((priv, i) => {
          const u = users.find(x => x.id === priv.userId);
          return (
            <div key={priv.id} className="fu" style={{animationDelay:`${i*.06}s`,background:`linear-gradient(135deg, ${T.purple}22, ${T.card})`,borderRadius:18,padding:16,marginBottom:12,border:`1px solid ${T.purple}44`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                <div>
                  <div style={{fontFamily:F.display,fontSize:20,color:T.text,letterSpacing:1.5}}>PRIVATE SESSION 🎯</div>
                  <div style={{fontSize:12,color:T.muted}}>{priv.time} · 60 min</div>
                  <div style={{fontSize:12,color:T.purple,marginTop:4}}>{priv.description}</div>
                </div>
                <div style={{padding:"4px 10px",borderRadius:20,fontSize:10,fontWeight:700,fontFamily:F.mono,background:T.purple+"22",color:T.purple,border:`1px solid ${T.purple}44`}}>1-ON-1</div>
              </div>
              <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                <div style={{fontSize:11,color:T.muted}}>Client: <b style={{color:T.text}}>{u ? u.name : priv.userId}</b></div>
                <button onClick={() => toggleA(priv.id)} style={{padding:"6px 12px", borderRadius:8, background:priv.isAttended?T.purple:T.bg, color:priv.isAttended?"#fff":T.purple, border:`1px solid ${T.purple}`, fontSize:11, fontWeight:700, cursor:"pointer"}}>
                  {priv.isAttended ? "✓ ATTENDED" : "MARK ATTENDANCE"}
                </button>
              </div>
            </div>
          );
        })}

        {/* RENDER KELAS REGULER */}
        {daySess.length===0?<Empty icon="🏖️" title="DAY OFF" sub="No sessions scheduled"/>:daySess.map((cls,i)=>{
          const enrolledMembers = bookings.filter(b => b.classId === cls.id && b.date === selDate.fullDate && b.paymentStatus === "verified");
          const attendedCount = enrolledMembers.filter(m => m.isAttended).length;

          return(
            <div key={cls.id} className="fu" style={{animationDelay:`${i*.06}s`,background:T.card,borderRadius:16,padding:14,marginBottom:10,border:`1px solid ${T.border}`,opacity:cls.status==="cancelled"?.5:1}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div>
                  <div style={{fontFamily:F.display,fontSize:19,color:T.text,letterSpacing:1.5}}>{cls.name}</div>
                  <div style={{fontSize:12,color:T.muted,marginTop:2}}>{cls.time} · {cls.duration}</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontFamily:F.display,fontSize:18,color:accent,letterSpacing:1}}>{attendedCount}/{enrolledMembers.length}</div>
                  <div style={{fontSize:10,color:T.muted,fontFamily:F.mono}}>ATTENDED</div>
                </div>
              </div>
              <div style={{marginTop:10,height:3,background:T.border,borderRadius:4,overflow:"hidden"}}>
                <div style={{width:`${enrolledMembers.length===0?0:(attendedCount/enrolledMembers.length)*100}%`,height:"100%",background:accent,borderRadius:4}}/>
              </div>

              {/* LIST MEMBER UNTUK KELAS REGULER (BISA DI-KLIK ABSEN) */}
              {!cls.status.includes("cancelled") && (
                <div style={{marginTop:12, paddingTop:12, borderTop:`1px dashed ${T.borderHi}`}}>
                  <div style={{fontSize:10, color:T.muted, marginBottom:8, fontFamily:F.mono}}>ENROLLED MEMBERS (TAP TO MARK)</div>
                  {enrolledMembers.length === 0 ? (
                    <div style={{fontSize:11, color:T.dim}}>No bookings yet for this date.</div>
                  ) : (
                    <div style={{display:"flex", gap:8, flexWrap:"wrap"}}>
                      {enrolledMembers.map(m => {
                        const u = users.find(x => x.id === m.userId);
                        const uName = u ? u.name : m.userId;
                        return (
                          <div key={m.id} onClick={() => toggleA(m.id)} className="rp" style={{
                            padding:"6px 10px", borderRadius:10, background: m.isAttended ? accent+"22" : T.bg, 
                            border:`1px solid ${m.isAttended ? accent : T.borderHi}`, cursor:"pointer", display:"flex", alignItems:"center", gap:6
                          }}>
                            <span style={{fontSize:10}}>{m.isAttended ? "✅" : "👤"}</span>
                            <span style={{fontSize:11, fontWeight:700, color: m.isAttended ? accent : T.muted}}>{uName}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TrainerClients({accent,trainer,bookings,users,clientNotes,setClientNotes}){
  const [active,setActive]=useState(null);
  const [noteIn,setNoteIn]=useState("");
  const [search,setSearch]=useState("");

  const trainerClassIds = bookings.filter(b => b.trainer === trainer?.name).map(b => b.userId);
  const uniqueUserIds = [...new Set(trainerClassIds)];
  const clients = uniqueUserIds.map(uid => {
    const u = users.find(x => x.id === uid);
    if (!u) return null;
    const userBookings = bookings.filter(b => b.userId === uid && b.trainer === trainer?.name);
    return {
      id: uid, name: u.name, class: userBookings[0]?.className || "Various",
      progress: Math.min(100, Math.round((userBookings.length / 20) * 100) + 20),
      sessions: userBookings.length, avatar: u.avatar || "👤",
      dbId: uid.replace("U", "") // Mengambil ID asli untuk dikirim ke DB
    };
  }).filter(Boolean);

  const filteredClients = clients.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  // 🟢 Hit API Backend
  const save = async (client) => {
    if(!noteIn.trim()) return;
    try {
      const res = await fetch(`${API_URL}/trainer/notes`, {
        method: 'POST',
        headers: API_HEADERS,
        body: JSON.stringify({ trainer_id: trainer.id, user_id: client.dbId, note: noteIn })
      });
      const data = await res.json();
      if(res.ok) {
        setClientNotes(prev => [...prev, data.data]);
        setNoteIn(""); setActive(null);
      }
    } catch { alert("Failed to save note"); }
  };

  return(
    <div style={{padding:"52px 20px 0"}}>
      <RoleBadge role="trainer" small/>
      <SecTitle title="ACTIVE CLIENTS" size={28}/>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search client name..." style={{width:"100%",background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"11px 16px",color:T.text,fontSize:13,marginBottom:16}}/>
      {filteredClients.length===0 && <Empty icon="👥" title="NO CLIENTS FOUND" sub="Search returned no results"/>}
      
      {filteredClients.map((c,i)=>{
        // 🟢 Ambil catatan khusus user ini dari Global State
        const myNotes = (clientNotes || []).filter(n => String(n.user_id) === String(c.dbId));
        return (
        <div key={c.id} className="fu" style={{animationDelay:`${i*.06}s`,background:T.card,borderRadius:18,padding:14,marginBottom:12,border:`1px solid ${T.border}`}}>
          <div style={{display:"flex",gap:12,alignItems:"center"}}>
            <div style={{width:46,height:46,borderRadius:13,background:accent+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{c.avatar}</div>
            <div style={{flex:1}}>
              <div style={{display:"flex",justifyContent:"space-between"}}>
                <div style={{fontWeight:700,color:T.text,fontSize:14}}>{c.name}</div>
                <div style={{fontSize:12,color:accent,fontFamily:F.mono,fontWeight:700}}>{c.progress}%</div>
              </div>
              <div style={{fontSize:12,color:T.muted}}>{c.class} · {c.sessions} sessions</div>
              <div style={{height:3,background:T.border,borderRadius:4,overflow:"hidden",marginTop:6}}>
                <div style={{width:`${c.progress}%`,height:"100%",background:`linear-gradient(90deg,${accent},${T.cyan})`,borderRadius:4}}/>
              </div>
            </div>
          </div>
          {/* 🟢 Render daftar catatan */}
          {myNotes.map((n,j)=>(
            <div key={j} style={{background:T.bg,borderRadius:8,padding:"7px 11px",marginTop:8,fontSize:12,color:T.muted,borderLeft:`2px solid ${accent}`}}>📝 {n.note} <span style={{color:T.dim,fontSize:10}}>· {n.date}</span></div>
          ))}
          {active===c.id?(
            <div style={{marginTop:10}}>
              <textarea value={noteIn} onChange={e=>setNoteIn(e.target.value)} placeholder="Progress notes..." rows={2} style={{width:"100%",background:T.bg,border:`1px solid ${accent}44`,borderRadius:10,padding:"9px 12px",color:T.text,fontSize:13,resize:"none",marginBottom:8}}/>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>save(c)} style={{flex:1,background:accent,color:T.bg,borderRadius:10,padding:8,fontFamily:F.display,fontSize:13,letterSpacing:1}}>SAVE</button>
                <button onClick={()=>setActive(null)} style={{background:T.border,color:T.muted,borderRadius:10,padding:"8px 12px"}}>✕</button>
              </div>
            </div>
          ):(
            <div className="rp" onClick={()=>setActive(c.id)} style={{marginTop:10,textAlign:"center",padding:7,borderRadius:10,border:`1px dashed ${accent}44`,fontSize:12,color:accent,cursor:"pointer",fontWeight:600}}>+ Add Note</div>
          )}
        </div>
      )})}
      <div style={{height:8}}/>
    </div>
  );
}

function TrainerProfile({user,trainer,myBranch,sched,bookings,onOpenRecap,onEditProfile,onLogout,accent,getTrainerStats}){
  const completedClasses = bookings.filter(b => b.trainer === trainer.name && b.type === "class" && b.isAttended).length;
  const completedPrivates = bookings.filter(b => b.trainer === trainer.name && b.type === "private" && b.isAttended).length;
  
  const earnings = (completedClasses * 150000) + (completedPrivates * 400000);
  const totalCompletedSessions = completedClasses + completedPrivates;

  const certsText = trainer.certs && trainer.certs.length > 0 ? trainer.certs.join(" · ") : "No certifications added";
  const docsText = trainer.docs && trainer.docs.length > 0 ? trainer.docs.join(" · ") : "No documents added";

  return(
    <div style={{padding:"52px 20px 0"}}>
      <div style={{background:`linear-gradient(140deg,${T.card},${T.surface})`,borderRadius:20,padding:20,marginBottom:16,border:`1px solid ${T.border}`}}>
        <div style={{display:"flex",gap:14,alignItems:"center"}}>
          <div style={{width:68,height:68,borderRadius:18,background:`linear-gradient(135deg,${accent},#99CC00)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:30,border:`2px solid ${accent}44`}}>{trainer.avatar}</div>
          <div>
            <RoleBadge role="trainer"/>
            <div style={{fontFamily:F.display,fontSize:22,color:T.text,letterSpacing:2,lineHeight:1,marginTop:6}}>{trainer.name.toUpperCase()}</div>
            <div style={{fontSize:12,color:T.muted,marginTop:2}}>{trainer.specialty}</div>
          </div>
        </div>
        {myBranch&&(
          <div style={{background:`linear-gradient(120deg,${myBranch.color}18,transparent)`,borderRadius:12,padding:"10px 14px",marginTop:14,border:`1px solid ${myBranch.color}33`}}>
            <div style={{fontSize:10,color:myBranch.color,fontFamily:F.mono,letterSpacing:2,marginBottom:2}}>HOME BRANCH</div>
            <div style={{fontWeight:700,color:T.text,fontSize:14}}>{myBranch.cover} {myBranch.name}</div>
            <div style={{fontSize:11,color:T.muted}}>{myBranch.address}</div>
          </div>
        )}
        <div style={{display:"flex",marginTop:14,background:T.bg+"88",borderRadius:12,overflow:"hidden"}}>
          {/* 👈 PERBAIKAN RATING DINAMIS */}
          {[{l:"Rating",v:`★ ${getTrainerStats(trainer.id).avg}`},{l:"Total Sesh",v:trainer.sessions+totalCompletedSessions},{l:"This Month",v:totalCompletedSessions}].map((s,i)=>(
            <div key={i} style={{flex:1,padding:"10px 0",textAlign:"center",borderRight:i<2?`1px solid ${T.border}`:"none"}}>
              <div style={{fontFamily:F.display,fontSize:20,color:accent,letterSpacing:1}}>{s.v}</div>
              <div style={{fontSize:10,color:T.muted}}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
      
      <div onClick={onOpenRecap}><MenuIt icon="⏱️" label="Attendance Log" sub="Clock-in & out history" /></div>
      <div onClick={onEditProfile}><MenuIt icon="✏️" label="Edit Profile" sub="Personal info, certs & docs"/></div>
      
      <MenuIt icon="💰" label="Earnings (This Month)" sub={`Rp ${earnings.toLocaleString("id")} (${totalCompletedSessions} clients attended)`} />
      <MenuIt icon="🎓" label="Certifications" sub={certsText}/>
      <MenuIt icon="📄" label="Documents" sub={docsText}/>

      <div className="rp" onClick={onLogout} style={{background:"#FF313118",borderRadius:14,padding:"14px 16px",marginTop:8,border:"1px solid #FF313133",display:"flex",alignItems:"center",gap:14,cursor:"pointer"}}>
        <div style={{width:40,height:40,borderRadius:12,background:"#FF313133",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>🚪</div>
        <div style={{fontWeight:700,color:T.red,fontSize:14}}>Logout</div>
      </div>
      <div style={{height:20}}/>
    </div>
  );
}

function TrainerRecapModal({logs, onClose, accent}) {
  const history = logs?.history || [];
  
  const grouped = history.reduce((acc, curr) => {
    if (!curr.time) return acc;

    // 🟢 UBAH SPASI JADI "T", TAPI JANGAN TAMBAHKAN "Z"
    let timeStrISO = String(curr.time).replace(/\.\d+/, "").trim();
    if (timeStrISO.includes(" ")) {
      timeStrISO = timeStrISO.replace(" ", "T");
    }
    timeStrISO = timeStrISO.replace("Z", ""); // Pastikan tidak dianggap UTC

    const dateObj = new Date(timeStrISO);
    if (isNaN(dateObj.getTime())) return acc;

    const d = dateObj.toLocaleDateString("en-GB", { day:"numeric", month:"short", year:"numeric" });
    if(!acc[d]) acc[d] = { in: "--:--", out: "--:--" };

    const timeStr = dateObj.toLocaleTimeString("en-US", { hour:"2-digit", minute:"2-digit", hour12:true });

    if(curr.type === "START") acc[d].in = timeStr;
    if(curr.type === "END") acc[d].out = timeStr;
    
    return acc;
  }, {});

  return (
    <Modal onClose={onClose}>
      <div style={{padding:"28px 24px 40px"}}>
        <div style={{fontFamily:F.display,fontSize:26,color:T.text,letterSpacing:2,marginBottom:16}}>WORKING HISTORY</div>
        <div style={{background:T.card, borderRadius:16, border:`1px solid ${T.border}`, overflow:"hidden"}}>
          <table style={{width:"100%", borderCollapse:"collapse", fontSize:12}}>
            <thead>
              <tr style={{background:T.surface, borderBottom:`1px solid ${T.border}`}}>
                <th style={{padding:12, textAlign:"left", color:T.muted}}>DATE</th>
                <th style={{padding:12, textAlign:"center", color:T.muted}}>IN</th>
                <th style={{padding:12, textAlign:"center", color:T.muted}}>OUT</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(grouped).length === 0 ? <tr><td colSpan="3" style={{padding:20, textAlign:"center", color:T.muted}}>No history found</td></tr> :
                Object.entries(grouped).reverse().map(([date, times]) => (
                  <tr key={date} style={{borderBottom:`1px solid ${T.border}`}}>
                    <td style={{padding:12, fontWeight:600, color:T.text}}>{date}</td>
                    <td style={{padding:12, textAlign:"center", color:accent, fontFamily:F.mono}}>{times.in}</td>
                    <td style={{padding:12, textAlign:"center", color:T.red, fontFamily:F.mono}}>{times.out}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
        <button onClick={onClose} style={{width:"100%",padding:14,borderRadius:12,background:accent,color:T.bg,fontFamily:F.display,fontSize:18,fontWeight:700,marginTop:20}}>CLOSE</button>
      </div>
    </Modal>
  );
}

/* ═══════════════════════════════════════════════════════════════
   BOOKING FLOW COMPONENTS
═══════════════════════════════════════════════════════════════ */
function PlanPicker({cls,onPick,onBack}){
  return(
    <div>
      {cls&&(
        <div style={{background:cls.color+"18",padding:"28px 24px 20px",borderBottom:`1px solid ${T.border}`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div>
              <div style={{fontSize:11,color:cls.color,fontWeight:700,letterSpacing:2,fontFamily:F.mono}}>{cls.category}</div>
              <div style={{fontFamily:F.display,fontSize:30,color:T.text,letterSpacing:2,lineHeight:1}}>{cls.name}</div>
              <div style={{fontSize:13,color:T.muted,marginTop:4}}>{cls.time} · {cls.day} · {cls.duration}</div>
            </div>
            <div style={{fontSize:40}}>{cls.icon}</div>
          </div>
        </div>
      )}
      <div style={{padding:"20px 24px"}}>
        <SecTitle title="SELECT PLAN"/>
        {plans.map(p=>(
          <div key={p.id} className="rp" onClick={()=>onPick(p)} style={{background:T.card,borderRadius:14,padding:"13px 15px",marginBottom:9,border:`1px solid ${p.badge==="POPULAR"?p.color:T.border}`,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",transition:"all .2s"}}>
            <div style={{display:"flex",gap:11,alignItems:"center"}}>
              <span style={{fontSize:22}}>{p.icon}</span>
              <div>
                <div style={{fontWeight:700,color:T.text,fontSize:14}}>{p.name}</div>
                {p.badge&&<div style={{fontSize:9,color:p.color,fontWeight:700,letterSpacing:1,fontFamily:F.mono}}>{p.badge}</div>}
              </div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontFamily:F.display,fontSize:19,color:p.color,letterSpacing:1}}>{(p.price/1000).toFixed(0)}K</div>
              <div style={{fontSize:10,color:T.muted}}>{p.period}</div>
            </div>
          </div>
        ))}
        <button onClick={onBack} style={{width:"100%",padding:13,borderRadius:12,background:"transparent",color:T.muted,fontSize:14,fontWeight:600,border:`1px solid ${T.border}`,marginTop:4}}>CANCEL</button>
      </div>
    </div>
  );
}

function PaySheet({cls,plan,payMethod,setPayMethod,onPay,onBack}){
  const meths=[{id:"gopay",icon:"💚",label:"GoPay"},{id:"ovo",icon:"💜",label:"OVO"},{id:"dana",icon:"💙",label:"DANA"},{id:"bca",icon:"🏦",label:"BCA VA"},{id:"bni",icon:"🏦",label:"BNI VA"},{id:"cc",icon:"💳",label:"Credit Card"}];
  return(
    <div>
      <div style={{padding:"26px 24px 14px",borderBottom:`1px solid ${T.border}`}}>
        <div style={{fontSize:11,color:T.muted,fontFamily:F.mono,letterSpacing:2,marginBottom:3}}>ORDER SUMMARY</div>
        <div style={{fontFamily:F.display,fontSize:26,color:T.text,letterSpacing:2}}>PAYMENT</div>
      </div>
      <div style={{padding:"18px 24px"}}>
        <div style={{background:T.card,borderRadius:14,padding:14,marginBottom:14,border:`1px solid ${T.border}`}}>
          {cls&&<div style={{display:"flex",justifyContent:"space-between",paddingBottom:12,borderBottom:`1px solid ${T.border}`,marginBottom:12}}>
            <div>
              <div style={{fontFamily:F.display,fontSize:17,color:T.text,letterSpacing:1}}>{cls.name}</div>
              <div style={{fontSize:12,color:T.muted}}>{cls.time} · {cls.day}</div>
            </div>
            <div style={{fontSize:18}}>{cls.icon}</div>
          </div>}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <span style={{fontSize:18}}>{plan.icon}</span>
              <div>
                <div style={{fontWeight:700,color:T.text,fontSize:14}}>{plan.name}</div>
                {plan.badge&&<div style={{fontSize:9,color:plan.color,fontWeight:700,fontFamily:F.mono}}>{plan.badge}</div>}
              </div>
            </div>
            <div style={{fontFamily:F.display,fontSize:20,color:plan.color,letterSpacing:1}}>Rp {plan.price.toLocaleString("id")}</div>
          </div>
        </div>
        <div style={{marginBottom:14}}>
          <SecTitle title="PAYMENT METHOD" size={14}/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}}>
            {meths.map(m=>(
              <div key={m.id} className="rp" onClick={()=>setPayMethod(m.id)} style={{padding:10,borderRadius:11,cursor:"pointer",display:"flex",alignItems:"center",gap:7,background:payMethod===m.id?plan.color+"22":T.card,border:`1.5px solid ${payMethod===m.id?plan.color:T.border}`,transition:"all .2s"}}>
                <span style={{fontSize:16}}>{m.icon}</span>
                <span style={{fontSize:11,fontWeight:700,color:payMethod===m.id?T.text:T.muted}}>{m.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{background:T.card,borderRadius:12,padding:"11px 14px",marginBottom:14,border:`1px solid ${T.border}`}}>
          <div style={{display:"flex",justifyContent:"space-between"}}>
            <span style={{fontFamily:F.display,fontSize:17,color:T.text,letterSpacing:1}}>TOTAL</span>
            <span style={{fontFamily:F.display,fontSize:20,color:plan.color,letterSpacing:1}}>Rp {plan.price.toLocaleString("id")}</span>
          </div>
        </div>
        <button onClick={onPay} style={{width:"100%",padding:15,borderRadius:12,fontFamily:F.display,fontSize:19,letterSpacing:2,background:plan.color,color:T.bg,fontWeight:700,marginBottom:8}}>PAY NOW</button>
        <button onClick={onBack} style={{width:"100%",padding:12,borderRadius:12,background:"transparent",color:T.muted,fontSize:14,fontWeight:600,border:`1px solid ${T.border}`}}>BACK</button>
      </div>
    </div>
  );
}

function SuccessSheet({booking,onDone,onHome,accent}){
  return(
    <div style={{padding:"40px 24px",textAlign:"center"}}>
      <div className="pi" style={{fontSize:76,marginBottom:14}}>🎉</div>
      <div style={{fontFamily:F.display,fontSize:32,color:accent,letterSpacing:3,marginBottom:8}}>BOOKING SUCCESS!</div>
      <div style={{fontSize:14,color:T.muted,marginBottom:26}}>Ticket saved to your account</div>
      <div style={{background:T.card,borderRadius:20,padding:20,border:`1px solid ${T.border}`,textAlign:"left",marginBottom:22,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,${accent},${T.cyan})`}}/>
        <div style={{fontFamily:F.display,fontSize:22,color:T.text,letterSpacing:2,marginBottom:4}}>{booking.className}</div>
        <div style={{fontSize:13,color:T.muted,marginBottom:14}}>{booking.trainer}</div>
        <div style={{display:"flex",gap:14,marginBottom:14}}>
          {[{l:"DATE",v:booking.date},{l:"TIME",v:booking.time},{l:"ID",v:booking.id}].map((f,i)=>(
            <div key={i}>
              <div style={{fontSize:9,color:T.dim,fontFamily:F.mono,letterSpacing:1}}>{f.l}</div>
              <div style={{fontSize:12,fontWeight:700,color:i===2?accent:T.text,marginTop:2,fontFamily:i===2?F.mono:F.body}}>{f.v}</div>
            </div>
          ))}
        </div>
        <div style={{borderTop:`2px dashed ${T.border}`,paddingTop:14,display:"flex",justifyContent:"center"}}>
          <div style={{background:T.bg,borderRadius:10,padding:"9px 16px",fontFamily:F.mono,fontSize:18,letterSpacing:5,color:accent}}>▐▌▐▌▐▌▐▌▐▌</div>
        </div>
      </div>
      <button onClick={onDone} style={{width:"100%",padding:15,borderRadius:12,fontFamily:F.display,fontSize:17,letterSpacing:2,background:accent,color:T.bg,fontWeight:700,marginBottom:9}}>VIEW TICKETS</button>
      <button onClick={onHome} style={{width:"100%",padding:12,borderRadius:12,background:"transparent",color:T.muted,fontSize:14,fontWeight:600,border:`1px solid ${T.border}`}}>BACK TO HOME</button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   NEW FEATURE MODALS
═══════════════════════════════════════════════════════════════ */

/* ── MEMBERSHIP PLANS SETTINGS ──────────────────────────────── */
function PlanSettingsModal({plans, setPlans, onClose, accent, setSyncQueue}) {
  const [view, setView] = useState("list");
  const [f, setF] = useState({ id:"", name:"", price:"", period:"/month", badge:"", icon:"🎟️", color:"#00E5FF" });
  const [loading, setLoading] = useState(false);

  const isNew = !plans.find(p => p.id === f.id);

  const handleSave = async () => {
    if (!f.id || !f.name || !f.price) return alert("ID, Name, and Price are required!");
    setLoading(true);
    
    // Pastikan harga adalah angka
    const payload = { ...f, price: parseInt(f.price) || 0 };

    // Update UI seketika (Optimistic Update)
    if (isNew) setPlans(prev => [...prev, payload]);
    else setPlans(prev => prev.map(p => p.id === payload.id ? payload : p));

    setView("list");

    // Hit API
    try {
      const res = await fetch(API_URL + '/admin/plans', {
        method: 'POST',
        headers: API_HEADERS,
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error();
    } catch(e) {
      setSyncQueue(prev => [...prev, { tempId: "PLAN_" + f.id, endpoint: '/admin/plans', data: payload }]);
      alert("Offline: Plan saved locally.");
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this plan?")) return;
    setPlans(prev => prev.filter(p => p.id !== id));
    
    try {
      await fetch(API_URL + '/admin/plans/' + id, { method: 'DELETE', headers: API_HEADERS });
    } catch(e) {
      console.error("Failed to delete from server");
    }
  };

  return (
    <Modal onClose={onClose}>
      <div style={{padding:"28px 24px 40px"}}>
        {view === "list" ? (
          <>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <div style={{fontFamily:F.display,fontSize:26,color:T.text,letterSpacing:2}}>MEMBERSHIP PLANS</div>
              <button onClick={()=>{setF({id:"",name:"",price:"",period:"/month",badge:"",icon:"🎟️",color:accent}); setView("form");}} style={{background:accent,color:T.bg,borderRadius:12,padding:"6px 12px",fontFamily:F.display,fontSize:14,letterSpacing:1,fontWeight:700}}>+ NEW</button>
            </div>
            
            {plans.map(p => (
              <div key={p.id} style={{background:T.card, borderRadius:14, padding:"14px", marginBottom:10, border:`1px solid ${T.border}`, display:"flex", alignItems:"center", gap:12}}>
                <div style={{fontSize:24, width:44, height:44, borderRadius:12, background:p.color+"22", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0}}>{p.icon}</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700, color:T.text, fontSize:14}}>{p.name} {p.badge && <span style={{fontSize:9, background:p.color+"22", color:p.color, padding:"2px 6px", borderRadius:6, marginLeft:4}}>{p.badge}</span>}</div>
                  <div style={{fontSize:12, color:T.muted, marginTop:2}}>Rp {parseInt(p.price).toLocaleString("id")} {p.period}</div>
                </div>
                <div style={{display:"flex", flexDirection:"column", gap:6}}>
                  <div onClick={()=>{setF(p); setView("form");}} className="rp" style={{fontSize:11, color:T.cyan, background:T.cyan+"22", padding:"4px 10px", borderRadius:8, fontWeight:700, cursor:"pointer", textAlign:"center"}}>Edit</div>
                  <div onClick={()=>handleDelete(p.id)} className="rp" style={{fontSize:11, color:T.red, background:T.red+"22", padding:"4px 10px", borderRadius:8, fontWeight:700, cursor:"pointer", textAlign:"center"}}>Del</div>
                </div>
              </div>
            ))}
            <button onClick={onClose} style={{width:"100%",padding:12,borderRadius:12,background:"transparent",color:T.muted,fontSize:14,fontWeight:600,border:`1px solid ${T.border}`,marginTop:16}}>CLOSE</button>
          </>
        ) : (
          <>
            <div onClick={()=>setView("list")} style={{display:"flex",alignItems:"center",gap:8,color:T.muted,fontSize:13,cursor:"pointer",marginBottom:16,fontWeight:600}}>← Back</div>
            <div style={{fontFamily:F.display,fontSize:24,color:T.text,letterSpacing:2,marginBottom:18}}>{isNew ? "NEW PLAN" : "EDIT PLAN"}</div>
            
            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:12}}>
              <div>
                <div style={{fontSize:11,color:T.muted,fontFamily:F.mono,marginBottom:6}}>PLAN ID (e.g. 'visit')</div>
                <input value={f.id} onChange={e=>setF({...f, id:e.target.value})} disabled={!isNew} placeholder="unique_id" style={{width:"100%",background:isNew?T.card:T.cardHi,border:`1px solid ${T.border}`,borderRadius:12,padding:"11px 14px",color:isNew?T.text:T.muted,fontSize:13}}/>
              </div>
              <div>
                <div style={{fontSize:11,color:T.muted,fontFamily:F.mono,marginBottom:6}}>DISPLAY NAME</div>
                <input value={f.name} onChange={e=>setF({...f, name:e.target.value})} placeholder="Monthly" style={{width:"100%",background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"11px 14px",color:T.text,fontSize:13}}/>
              </div>
            </div>

            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:12}}>
              <div>
                <div style={{fontSize:11,color:T.muted,fontFamily:F.mono,marginBottom:6}}>PRICE (Rp)</div>
                <input type="number" value={f.price} onChange={e=>setF({...f, price:e.target.value})} placeholder="350000" style={{width:"100%",background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"11px 14px",color:T.text,fontSize:13}}/>
              </div>
              <div>
                <div style={{fontSize:11,color:T.muted,fontFamily:F.mono,marginBottom:6}}>PERIOD (e.g. /month)</div>
                <input value={f.period} onChange={e=>setF({...f, period:e.target.value})} placeholder="/month" style={{width:"100%",background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"11px 14px",color:T.text,fontSize:13}}/>
              </div>
            </div>

            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:20}}>
              <div>
                <div style={{fontSize:11,color:T.muted,fontFamily:F.mono,marginBottom:6}}>BADGE</div>
                <input value={f.badge} onChange={e=>setF({...f, badge:e.target.value})} placeholder="POPULAR" style={{width:"100%",background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"11px 14px",color:T.text,fontSize:13}}/>
              </div>
              <div>
                <div style={{fontSize:11,color:T.muted,fontFamily:F.mono,marginBottom:6}}>ICON</div>
                <input value={f.icon} onChange={e=>setF({...f, icon:e.target.value})} style={{width:"100%",background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"11px 14px",color:T.text,fontSize:13,textAlign:"center"}}/>
              </div>
              <div>
                <div style={{fontSize:11,color:T.muted,fontFamily:F.mono,marginBottom:6}}>COLOR</div>
                <input type="color" value={f.color} onChange={e=>setF({...f, color:e.target.value})} style={{width:"100%",height:40,background:T.card,border:`1px solid ${T.border}`,borderRadius:12,cursor:"pointer"}}/>
              </div>
            </div>

            <button onClick={handleSave} disabled={loading} style={{width:"100%",padding:14,borderRadius:12,fontFamily:F.display,fontSize:18,letterSpacing:2,background:accent,color:T.bg,fontWeight:700}}>{loading?"SAVING...":"SAVE PLAN"}</button>
          </>
        )}
      </div>
    </Modal>
  );
}

/* ── GYM SETTINGS ──────────────────────────────────────────── */
function GymSettingsModal({branches,gymSettings,setGymSettings,onClose,accent}){
  const [selBranch,setSelBranch]=useState(branches[0]?.id||"");
  const cfg=gymSettings[selBranch]||{};
  const upd=(k,v)=>setGymSettings(p=>({...p,[selBranch]:{...p[selBranch],[k]:v}}));
  const [loading, setLoading] = useState(false); // 👈 State loading dimasukkan ke sini
  
  const fields=[
    {k:"hours",       label:"Operating Hours",    ph:"05:00–23:00"},
    {k:"maxCapacity", label:"Max Capacity",       ph:"200",  type:"number"},
    {k:"emergencyPhone",label:"Emergency Phone",   ph:"0361-5550000"},
    {k:"wifi",        label:"WiFi Network Name",   ph:"GYM_WiFi_5G"},
    {k:"lockerCount", label:"Total Lockers",       ph:"80",   type:"number"},
    {k:"parkingSlots",label:"Parking Slots",       ph:"50",   type:"number"},
  ];

  // 👈 Fungsi simpan ke Laravel ditaruh di dalam komponennya
  const handleSaveToDB = async () => {
    setLoading(true);
    try {
      await fetch(`${API_URL}/admin/branches/${selBranch}/settings`, {
        method: 'POST',
        headers: API_HEADERS,
        body: JSON.stringify(cfg)
      });
      alert("Settings saved to server!");
    } catch(e) {
      alert("Offline: Saved locally, will sync later.");
    }
    setLoading(false);
    onClose();
  };

  return(
    <Modal onClose={onClose}>
      <div style={{padding:"28px 24px 40px"}}>
        <div style={{fontFamily:F.display,fontSize:26,color:T.text,letterSpacing:2,marginBottom:4}}>GYM SETTINGS</div>
        <div style={{fontSize:13,color:T.muted,marginBottom:18}}>Configure settings per branch</div>
        
        {/* Branch selector */}
        <div style={{display:"flex",gap:8,overflowX:"auto",marginBottom:20,paddingBottom:4}}>
          {branches.map(b=>(
            <div key={b.id} className="rp" onClick={()=>setSelBranch(b.id)} style={{display:"flex",alignItems:"center",gap:6,padding:"7px 14px",borderRadius:20,fontSize:11,fontWeight:700,whiteSpace:"nowrap",background:selBranch===b.id?b.color:"transparent",color:selBranch===b.id?T.bg:T.muted,border:`1px solid ${selBranch===b.id?b.color:T.border}`,cursor:"pointer",transition:"all .2s"}}>
              {b.cover} {b.short}
            </div>
          ))}
        </div>
        
        {/* Selected branch header */}
        {branches.find(b=>b.id===selBranch)&&(
          <div style={{background:branches.find(b=>b.id===selBranch).color+"18",borderRadius:14,padding:"12px 14px",marginBottom:16,border:`1px solid ${branches.find(b=>b.id===selBranch).color}44`}}>
            <div style={{fontFamily:F.display,fontSize:18,color:T.text,letterSpacing:1}}>{branches.find(b=>b.id===selBranch).name}</div>
            <div style={{fontSize:12,color:T.muted}}>{branches.find(b=>b.id===selBranch).address}</div>
          </div>
        )}
        
        {/* Render Form */}
        {fields.map(f=>(
          <div key={f.k} style={{marginBottom:12}}>
            <div style={{fontSize:11,color:T.muted,fontFamily:F.mono,letterSpacing:2,marginBottom:6}}>{f.label.toUpperCase()}</div>
            <input
              type={f.type||"text"}
              value={cfg[f.k]||""}
              onChange={e=>upd(f.k,f.type==="number"?parseInt(e.target.value)||0:e.target.value)}
              placeholder={f.ph}
              style={{width:"100%",background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"11px 14px",color:T.text,fontSize:13}}
            />
          </div>
        ))}
        
        {/* 👈 Tombolnya diubah memanggil handleSaveToDB */}
        <button onClick={handleSaveToDB} disabled={loading} style={{width:"100%",padding:14,borderRadius:12,fontFamily:F.display,fontSize:18,letterSpacing:2,background:accent,color:T.bg,fontWeight:700, marginTop:16}}>
          {loading ? "SAVING..." : "SAVE & DONE"}
        </button>
      </div>
    </Modal>
  );
}

/* ── FULL REPORTS ───────────────────────────────────────────── */
function FullReportsModal({branches,members,classes,bookings,sales,trainers,onClose,accent}){
  const [selBranch,setSelBranch]=useState("ALL");
  const [subTab,setSubTab]=useState("overview");

  const filtM = selBranch==="ALL" ? members : members.filter(m=>m.branchId===selBranch);
  const filtC = selBranch==="ALL" ? classes  : classes.filter(c=>c.branchId===selBranch);
  const filtB = selBranch==="ALL" ? bookings : bookings.filter(b=>b.branchId===selBranch);
  const filtT = selBranch==="ALL" ? trainers : trainers.filter(t=>t.branchId===selBranch);

  const totalRevFromBookings = filtB.filter(b=>b.paymentStatus==="verified").reduce((s,b)=>s+b.amount,0);
  const totalRevFromSales    = sales.reduce((s,sl)=>s+sl.revenue,0);
  const totalRev = totalRevFromBookings + totalRevFromSales;
  const activeMembers = filtM.filter(m=>m.status!=="inactive").length;
  const activeClasses = filtC.filter(c=>c.status==="active").length;
  const avgFill = filtC.length>0
    ? Math.round(filtC.reduce((s,c)=>s+((c.total-c.slots)/c.total)*100,0)/filtC.length)
    : 0;

  const catCounts = filtC.reduce((acc,c)=>{acc[c.category]=(acc[c.category]||0)+1;return acc;},{});

  return(
    <Modal onClose={onClose}>
      <div style={{padding:"28px 24px 40px"}}>
        <div style={{fontFamily:F.display,fontSize:26,color:T.text,letterSpacing:2,marginBottom:4}}>FULL REPORTS</div>
        <div style={{fontSize:13,color:T.muted,marginBottom:14}}>Real-time analytics across all branches</div>

        {/* Branch filter */}
        <div style={{display:"flex",gap:7,overflowX:"auto",marginBottom:16,paddingBottom:4}}>
          {[{id:"ALL",name:"All",color:accent},...branches.map(b=>({id:b.id,name:b.short,color:b.color}))].map(b=>(
            <div key={b.id} className="rp" onClick={()=>setSelBranch(b.id)} style={{padding:"5px 12px",borderRadius:20,fontSize:11,fontWeight:700,whiteSpace:"nowrap",background:selBranch===b.id?b.color:"transparent",color:selBranch===b.id?T.bg:T.muted,border:`1px solid ${selBranch===b.id?b.color:T.border}`,cursor:"pointer",transition:"all .2s",fontFamily:F.mono}}>{b.name}</div>
          ))}
        </div>

        {/* Sub tabs */}
        <div style={{display:"flex",gap:6,marginBottom:18}}>
          {["overview","members","classes","trainers"].map(t=>(
            <div key={t} className="rp" onClick={()=>setSubTab(t)} style={{flex:1,padding:"8px 4px",borderRadius:10,fontSize:10,fontWeight:700,textAlign:"center",background:subTab===t?accent:"transparent",color:subTab===t?T.bg:T.muted,border:`1px solid ${subTab===t?accent:T.border}`,cursor:"pointer",transition:"all .2s",textTransform:"uppercase",letterSpacing:.5}}>{t}</div>
          ))}
        </div>

        {subTab==="overview"&&(
          <div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
              {[
                {l:"Total Revenue",  v:`Rp ${(totalRev/1000000).toFixed(2)}M`,        c:T.green},
                {l:"Active Members", v:activeMembers,                                  c:accent},
                {l:"Active Classes", v:activeClasses,                                  c:T.lime},
                {l:"Avg Fill Rate",  v:`${avgFill}%`,                                  c:T.cyan},
                {l:"Total Bookings", v:filtB.length,                                   c:T.purple},
                {l:"Trainers Active",v:filtT.filter(t=>t.status!=="released").length,  c:T.yellow},
              ].map((s,i)=>(
                <div key={i} style={{background:T.card,borderRadius:14,padding:14,border:`1px solid ${T.border}`}}>
                  <div style={{fontSize:10,color:T.muted,marginBottom:6}}>{s.l}</div>
                  <div style={{fontFamily:F.display,fontSize:22,color:s.c,letterSpacing:1}}>{s.v}</div>
                </div>
              ))}
            </div>
            {/* Per-branch table */}
            <div style={{fontSize:11,color:T.muted,fontFamily:F.mono,letterSpacing:2,marginBottom:8}}>PER BRANCH BREAKDOWN</div>
            {branches.map(b=>{
              const bM=members.filter(m=>m.branchId===b.id).length;
              const bC=classes.filter(c=>c.branchId===b.id&&c.status==="active").length;
              const bB=bookings.filter(bk=>bk.branchId===b.id&&bk.paymentStatus==="verified");
              const bRev=bB.reduce((s,bk)=>s+(parseInt(bk.amount)||0),0);
              return(
                <div key={b.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:`1px solid ${T.border}`}}>
                  <span style={{fontSize:18}}>{b.cover}</span>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:700,color:T.text}}>{b.short}</div>
                    <div style={{fontSize:11,color:T.muted}}>{bM} members · {bC} classes</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontFamily:F.display,fontSize:15,color:b.color}}>Rp {(bRev/1000000).toFixed(2)}M</div>
                    <div style={{fontSize:10,color:T.muted}}>revenue</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {subTab==="members"&&(
          <div>
            <div style={{fontSize:11,color:T.muted,fontFamily:F.mono,letterSpacing:2,marginBottom:12}}>MEMBER ANALYTICS</div>
            {[
              {l:"Total Registered", v:filtM.length},
              {l:"Active Members",   v:activeMembers},
              {l:"Inactive Members", v:filtM.filter(m=>m.status==="inactive").length},
              {l:"Monthly Plan",     v:filtM.filter(m=>m.plan==="Monthly").length},
              {l:"Annual Plan",      v:filtM.filter(m=>m.plan==="Annual").length},
              {l:"Quarterly Plan",   v:filtM.filter(m=>m.plan==="Quarterly").length},
              {l:"Per Visit",        v:filtM.filter(m=>m.plan==="Per Visit").length},
              {l:"Avg Classes/Member",v:filtM.length>0?Math.round(filtM.reduce((s,m)=>s+(m.totalClasses||0),0)/filtM.length):0},
            ].map((s,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${T.border}`}}>
                <div style={{fontSize:13,color:T.muted}}>{s.l}</div>
                <div style={{fontFamily:F.display,fontSize:17,color:T.text,letterSpacing:1}}>{s.v}</div>
              </div>
            ))}
          </div>
        )}

        {subTab==="classes"&&(
          <div>
            <div style={{fontSize:11,color:T.muted,fontFamily:F.mono,letterSpacing:2,marginBottom:12}}>CLASS ANALYTICS</div>
            {[
              {l:"Total Classes",    v:filtC.length},
              {l:"Active",           v:activeClasses},
              {l:"Cancelled",        v:filtC.filter(c=>c.status==="cancelled").length},
              {l:"Online / Virtual", v:classes.filter(c=>c.branchId==="ONLINE").length},
              {l:"Avg Fill Rate",    v:`${avgFill}%`},
              {l:"Total Capacity",   v:filtC.reduce((s,c)=>s+c.total,0)},
            ].map((s,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${T.border}`}}>
                <div style={{fontSize:13,color:T.muted}}>{s.l}</div>
                <div style={{fontFamily:F.display,fontSize:17,color:T.text,letterSpacing:1}}>{s.v}</div>
              </div>
            ))}
            <div style={{fontSize:11,color:T.muted,fontFamily:F.mono,letterSpacing:2,marginTop:16,marginBottom:8}}>BY CATEGORY</div>
            {Object.entries(catCounts).sort((a,b)=>b[1]-a[1]).map(([cat,cnt])=>(
              <div key={cat} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${T.border}`}}>
                <div style={{fontSize:12,color:T.muted}}>{cat}</div>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <div style={{width:60,height:4,background:T.border,borderRadius:4,overflow:"hidden"}}>
                    <div style={{width:`${(cnt/filtC.length)*100}%`,height:"100%",background:accent,borderRadius:4}}/>
                  </div>
                  <div style={{fontFamily:F.mono,fontSize:12,color:T.text,width:20,textAlign:"right"}}>{cnt}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {subTab==="trainers"&&(
          <div>
            <div style={{fontSize:11,color:T.muted,fontFamily:F.mono,letterSpacing:2,marginBottom:12}}>TRAINER ANALYTICS</div>
            {filtT.map((tr,i)=>{
              const trClasses=filtC.filter(c=>c.trainerId===tr.id);
              const trStudents=trClasses.reduce((s,c)=>s+(c.total-c.slots),0);
              return(
                <div key={tr.id} style={{display:"flex",gap:10,alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${T.border}`}}>
                  <div style={{fontSize:22}}>{tr.avatar}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:700,color:T.text}}>{tr.name}</div>
                    <div style={{fontSize:11,color:T.muted}}>{tr.specialty}</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:12,color:T.lime,fontFamily:F.mono}}>{trClasses.length} cls · {trStudents} stu</div>
                    <div style={{fontSize:11,color:T.yellow}}>★ {tr.rating}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <button onClick={onClose} style={{width:"100%",padding:14,borderRadius:12,fontFamily:F.display,fontSize:18,letterSpacing:2,background:accent,color:T.bg,fontWeight:700,marginTop:20}}>CLOSE</button>
      </div>
    </Modal>
  );
}

/* ── SECURITY ───────────────────────────────────────────────── */
function SecurityModal({user,securityLog,addSecurityEvent,updateUser,onClose,accent}){
  const [subTab,setSubTab]=useState("password");
  const [twoFA,setTwoFA]=useState(user.twoFA||false);
  const [curPass,setCurPass]=useState("");
  const [newPass,setNewPass]=useState("");
  const [confPass,setConfPass]=useState("");
  const [passMsg,setPassMsg]=useState(null);

  const handleChangePw=()=>{
    if(curPass!==user.pass){setPassMsg({ok:false,msg:"Current password is incorrect"});return;}
    if(newPass.length<4){setPassMsg({ok:false,msg:"New password must be at least 4 characters"});return;}
    if(newPass!==confPass){setPassMsg({ok:false,msg:"New passwords do not match"});return;}
    updateUser(user.id,{pass:newPass});
    addSecurityEvent("Password changed","App");
    setPassMsg({ok:true,msg:"Password changed successfully!"});
    setCurPass("");setNewPass("");setConfPass("");
  };

  const toggle2FA=()=>{
    const next=!twoFA;
    setTwoFA(next);
    updateUser(user.id,{twoFA:next});
    addSecurityEvent(next?"Two-Factor Authentication enabled":"Two-Factor Authentication disabled","App");
  };

  return(
    <Modal onClose={onClose}>
      <div style={{padding:"28px 24px 40px"}}>
        <div style={{fontFamily:F.display,fontSize:26,color:T.text,letterSpacing:2,marginBottom:4}}>SECURITY</div>
        <div style={{fontSize:13,color:T.muted,marginBottom:16}}>Manage password, 2FA and login history</div>

        <div style={{display:"flex",gap:6,marginBottom:20}}>
          {["password","2fa","history"].map(t=>(
            <div key={t} className="rp" onClick={()=>setSubTab(t)} style={{flex:1,padding:"8px 4px",borderRadius:10,fontSize:10,fontWeight:700,textAlign:"center",background:subTab===t?accent:"transparent",color:subTab===t?T.bg:T.muted,border:`1px solid ${subTab===t?accent:T.border}`,cursor:"pointer",transition:"all .2s",textTransform:"uppercase",letterSpacing:.5}}>{t==="2fa"?"2FA":t}</div>
          ))}
        </div>

        {subTab==="password"&&(
          <div>
            {[
              {label:"Current Password",  val:curPass,  set:setCurPass},
              {label:"New Password",      val:newPass,  set:setNewPass},
              {label:"Confirm Password",  val:confPass, set:setConfPass},
            ].map((f,i)=>(
              <div key={i} style={{marginBottom:12}}>
                <div style={{fontSize:11,color:T.muted,fontFamily:F.mono,letterSpacing:2,marginBottom:6}}>{f.label.toUpperCase()}</div>
                <input type="password" value={f.val} onChange={e=>f.set(e.target.value)} placeholder="••••••••"
                  style={{width:"100%",background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"11px 14px",color:T.text,fontSize:14}}/>
              </div>
            ))}
            {passMsg&&(
              <div style={{background:passMsg.ok?T.green+"22":"#FF313122",border:`1px solid ${passMsg.ok?T.green+"44":"#FF313144"}`,borderRadius:10,padding:"9px 14px",marginBottom:12,fontSize:13,color:passMsg.ok?T.green:T.red,fontWeight:600}}>
                {passMsg.ok?"✓":"⚠️"} {passMsg.msg}
              </div>
            )}
            <button onClick={handleChangePw} disabled={!curPass||!newPass||!confPass} style={{width:"100%",padding:14,borderRadius:12,fontFamily:F.display,fontSize:18,letterSpacing:2,background:curPass&&newPass&&confPass?accent:T.border,color:curPass&&newPass&&confPass?T.bg:T.dim,fontWeight:700}}>
              CHANGE PASSWORD
            </button>
          </div>
        )}

        {subTab==="2fa"&&(
          <div>
            <div style={{background:T.card,borderRadius:16,padding:20,border:`1px solid ${T.border}`,marginBottom:16}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <div>
                  <div style={{fontWeight:700,color:T.text,fontSize:15}}>Two-Factor Authentication</div>
                  <div style={{fontSize:12,color:T.muted,marginTop:4}}>Add an extra layer of security to your account</div>
                </div>
                <div className="rp" onClick={toggle2FA} style={{width:52,height:28,borderRadius:14,background:twoFA?T.green:T.border,position:"relative",cursor:"pointer",transition:"all .3s"}}>
                  <div style={{position:"absolute",top:4,left:twoFA?26:4,width:20,height:20,borderRadius:"50%",background:"#fff",transition:"all .3s",boxShadow:"0 2px 4px rgba(0,0,0,.3)"}}/>
                </div>
              </div>
              <div style={{fontSize:11,color:twoFA?T.green:T.muted,fontFamily:F.mono,fontWeight:700}}>
                {twoFA?"● 2FA ACTIVE — Account protected":"○ 2FA INACTIVE — Enable for better security"}
              </div>
            </div>
            {twoFA&&(
              <div style={{background:T.green+"18",border:`1px solid ${T.green}44`,borderRadius:12,padding:"12px 14px"}}>
                <div style={{fontSize:12,color:T.green,fontWeight:600,marginBottom:4}}>✓ 2FA is active</div>
                <div style={{fontSize:11,color:T.muted}}>You'll be prompted for a verification code on each login. Authenticator app: Google Authenticator or Authy.</div>
              </div>
            )}
          </div>
        )}

        {subTab==="history"&&(
          <div>
            <div style={{fontSize:11,color:T.muted,fontFamily:F.mono,letterSpacing:2,marginBottom:12}}>LOGIN & SECURITY EVENTS</div>
            {securityLog.length===0
              ?<Empty icon="🔒" title="NO EVENTS" sub="Security events will appear here"/>
              :securityLog.map((ev,i)=>(
                <div key={ev.id} style={{display:"flex",gap:12,alignItems:"flex-start",padding:"10px 0",borderBottom:i<securityLog.length-1?`1px solid ${T.border}`:"none"}}>
                  <div style={{width:8,height:8,borderRadius:"50%",background:ev.event.toLowerCase().includes("fail")?"#FF3131":T.green,marginTop:5,flexShrink:0}}/>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:600,color:T.text}}>{ev.event}</div>
                    <div style={{fontSize:11,color:T.muted,marginTop:2}}>{ev.device} · {ev.ip}</div>
                  </div>
                  <div style={{fontSize:10,color:T.dim,fontFamily:F.mono,textAlign:"right",flexShrink:0}}>
                    {new Date(ev.time).toLocaleString("en",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}
                  </div>
                </div>
              ))
            }
          </div>
        )}

        <button onClick={onClose} style={{width:"100%",padding:12,borderRadius:12,background:"transparent",color:T.muted,fontSize:14,fontWeight:600,border:`1px solid ${T.border}`,marginTop:16}}>CLOSE</button>
      </div>
    </Modal>
  );
}

/* ── ADMIN: EDIT ANY USER/TRAINER PROFILE ───────────────────── */
function EditProfileModal({target,role,branches,trainers,users,updateUser,updateTrainer,onClose,accent,plans}){
  const isTrainer = role==="trainer";
  const trainerRecord = isTrainer ? target : null;

  const [f,setF]=useState({
    name:           target.name        || "",
    email:          target.email       || "",
    phone:          target.phone       || "",
    dob:            target.dob         || "",
    address:        target.address     || "",
    emergencyContact: target.emergencyContact || "",
    specialty:      trainerRecord?.specialty || "",
    bio:            trainerRecord?.bio       || "",
    ig:             trainerRecord?.ig        || "",
    certs:          Array.isArray(trainerRecord?.certs) ? trainerRecord.certs.join(", ") : "",
    docs:           Array.isArray(trainerRecord?.docs) ? trainerRecord.docs.join("\n")  : "",
    plan:           target.plan        || "Monthly",
    branchId:       target.branchId    || branches[0]?.id || "",
  });

  const s=(k,v)=>setF(p=>({...p,[k]:v}));
  const [saved,setSaved]=useState(false);
  const [preview, setPreview] = useState(target.avatar || "👤");

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (upload) => {
      setPreview(upload.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave=()=>{
    const common={name:f.name,email:f.email,phone:f.phone,dob:f.dob,address:f.address,emergencyContact:f.emergencyContact, avatar: preview};

    if(isTrainer){
      const trainerUpdates = {
        ...common,
        specialty:f.specialty, bio:f.bio, ig:f.ig,
        certs:f.certs.split(",").map(c=>c.trim()).filter(Boolean),
        docs:f.docs.split("\n").map(d=>d.trim()).filter(Boolean),
      };
      updateTrainer(target.id, trainerUpdates);

      const linkedUser = users?.find(u => u.trainerId === target.id);
      if (linkedUser) updateUser(linkedUser.id, trainerUpdates);

    } else {
      updateUser(target.id,{...common, plan:f.plan, branchId:f.branchId});
    }

    setSaved(true);
    setTimeout(()=>setSaved(false),2000);
  };

  // 🔥 PERBAIKAN: Diubah menjadi pemanggilan fungsi langsung, bukan sebagai Component agar kursor tidak hilang
  const renderInput = (k, label, ph, type="text", multiline=false) => (
    <div key={k} style={{marginBottom:12}}>
      <div style={{fontSize:11,color:T.muted,fontFamily:F.mono,letterSpacing:2,marginBottom:6}}>{label.toUpperCase()}</div>
      {multiline
        ?<textarea value={f[k] || ""} onChange={e=>s(k,e.target.value)} placeholder={ph} rows={3}
            style={{width:"100%",background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"11px 14px",color:T.text,fontSize:13,resize:"none"}}/>
        :<input type={type} value={f[k] || ""} onChange={e=>s(k,e.target.value)} placeholder={ph}
            style={{width:"100%",background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"11px 14px",color:T.text,fontSize:13}}/>
      }
    </div>
  );

  return(
    <Modal onClose={onClose}>
      <div style={{padding:"28px 24px 40px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
          <div style={{fontFamily:F.display,fontSize:24,color:T.text,letterSpacing:2}}>EDIT PROFILE</div>
          <div style={{padding:"3px 10px",borderRadius:20,fontSize:10,fontWeight:700,fontFamily:F.mono,background:isTrainer?T.lime+"22":T.cyan+"22",color:isTrainer?T.lime:T.cyan,border:`1px solid ${isTrainer?T.lime+"44":T.cyan+"44"}`}}>
            {isTrainer?"TRAINER":"MEMBER"}
          </div>
        </div>
        <div style={{fontSize:13,color:T.muted,marginBottom:18}}>Editing: <b style={{color:T.text}}>{target.name}</b></div>

        <div style={{display:"flex", flexDirection:"column", alignItems:"center", marginBottom:20}}>
          <div style={{width:80, height:80, borderRadius:"50%", background:T.card, border:`2px solid ${accent}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:36, overflow:"hidden"}}>
            {preview.length > 10 ? <img src={preview} style={{width:"100%", height:"100%", objectFit:"cover"}} alt="Profile" /> : preview}
          </div>
          <label style={{marginTop:8, fontSize:11, color:accent, fontWeight:700, cursor:"pointer", background:accent+"18", padding:"4px 12px", borderRadius:20, border:`1px solid ${accent}44`}}>
            CHANGE PHOTO
            <input type="file" accept="image/*" onChange={handlePhotoChange} style={{display:"none"}} />
          </label>
        </div>

        {renderInput("name", "Full Name", "Full name")}
        {renderInput("email", "Email", "email@example.com", "email")}
        {renderInput("phone", "Phone Number", "+62 8xx-xxxx-xxxx", "tel")}
        {renderInput("dob", "Date of Birth", "Pilih Tanggal", "date")}
        {renderInput("address", "Address", "Street, City, Province", "text", true)}
        {!isTrainer && renderInput("emergencyContact", "Emergency Contact", "Name (phone)")}

        {isTrainer && (
          <>
            {renderInput("specialty", "Specialty", "HIIT & Strength")}
            {renderInput("bio", "Bio", "Short bio...", "text", true)}
            {renderInput("ig", "Instagram", "@handle")}
            {renderInput("certs", "Certifications (comma separated)", "ACE, NSCA, RYT-200")}
            {renderInput("docs", "Documents (one per line)", "ACE Certificate (2020)", "text", true)}
          </>
        )}

{!isTrainer && (
  <div style={{marginBottom:12}}>
    <div style={{fontSize:11, color:T.muted, fontFamily:F.mono, letterSpacing:2, marginBottom:6}}>MEMBERSHIP PLAN</div>
    <div style={{display:"flex", gap:7, flexWrap:"wrap"}}>
      {plans && plans.map(p => (
        <div 
          key={p.id} 
          className="rp" 
          onClick={() => s("plan", p.name)} 
          style={{
            padding: "6px 13px", 
            borderRadius: 10, 
            fontSize: 11, 
            fontWeight: 700, 
            background: f.plan === p.name ? accent : T.card, 
            color: f.plan === p.name ? T.bg : T.muted, 
            border: `1px solid ${f.plan === p.name ? accent : T.border}`, 
            cursor: "pointer",
            transition: "all .2s"
          }}
        >
          {p.name}
        </div>
      ))}
    </div>
  </div>
)}

        {saved&&<div style={{background:T.green+"22",border:`1px solid ${T.green}44`,borderRadius:10,padding:"9px 14px",marginBottom:12,fontSize:13,color:T.green,fontWeight:600}}>✓ Profile saved & synced!</div>}

        <button onClick={handleSave} style={{width:"100%",padding:14,borderRadius:12,fontFamily:F.display,fontSize:18,letterSpacing:2,background:accent,color:T.bg,fontWeight:700,marginBottom:8}}>SAVE CHANGES</button>
        <button onClick={onClose} style={{width:"100%",padding:11,borderRadius:12,background:"transparent",color:T.muted,fontSize:13,fontWeight:600,border:`1px solid ${T.border}`}}>CANCEL</button>
      </div>
    </Modal>
  );
}

/* ── SELF-EDIT PROFILE (Member & Trainer editing own data) ──── */
function SelfEditProfileModal({user,trainer,role,updateUser,updateTrainer,securityLog,addSecurityEvent,onClose,accent,plans}){
  const isTrainer = role==="trainer";
  const target = isTrainer ? trainer : user;

  const defaultAvatars = ["👤", "💪", "🏋️", "🧘", "🥊"];
  const getRandomAvatar = () => defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)];

  const [preview, setPreview] = useState(target?.avatar || getRandomAvatar());

  const [subTab,setSubTab]=useState("personal");
  const [f,setF]=useState({
    name:             target?.name              || "",
    email:            target?.email || user?.email || "",
    phone:            target?.phone             || "",
    dob:              target?.dob               || "",
    address:          target?.address           || "",
    emergencyContact: target?.emergencyContact  || "",
    avatar:           target?.avatar            || preview,
    plan:             target?.plan              || "Monthly",
    bio:              target?.bio               || "",
    ig:               target?.ig                || "",
    certs:            Array.isArray(target?.certs) ? target.certs.join(", ") : "",
    docs:             Array.isArray(target?.docs) ? target.docs.join("\n")  : "",
  });

  const [curPass, setCurPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confPass, setConfPass] = useState("");
  const [passMsg, setPassMsg] = useState(null);

  const s=(k,v)=>setF(p=>({...p,[k]:v}));
  const [saved,setSaved]=useState(false);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (upload) => {
      const base64 = upload.target.result;
      setPreview(base64);
      s("avatar", base64);
    };
    reader.readAsDataURL(file);
  };

  const handleSavePersonal=()=>{
    const updates={
      name:f.name, email:f.email, phone:f.phone,
      dob:f.dob, address:f.address,
      emergencyContact:f.emergencyContact,
      avatar: f.avatar,
      plan: f.plan
    };

    if(isTrainer) {
      const trainerUpdates = {
        ...updates, bio:f.bio, ig:f.ig,
        certs:f.certs.split(",").map(c=>c.trim()).filter(Boolean),
        docs:f.docs.split("\n").map(d=>d.trim()).filter(Boolean)
      };
      updateTrainer(target.id, trainerUpdates);
      updateUser(user.id, trainerUpdates);
    } else {
      updateUser(user.id, updates);
    }

    setSaved(true);
    setTimeout(()=>setSaved(false),2000);
  };

  const handleChangePw=()=>{
    const curRecord = isTrainer ? user : user;
    if(curPass!==curRecord.pass){setPassMsg({ok:false,msg:"Current password is incorrect"});return;}
    if(newPass.length<4){setPassMsg({ok:false,msg:"Min. 4 characters"});return;}
    if(newPass!==confPass){setPassMsg({ok:false,msg:"Passwords do not match"});return;}
    updateUser(user.id,{pass:newPass});
    addSecurityEvent&&addSecurityEvent("Password changed","App");
    setPassMsg({ok:true,msg:"Password changed!"});
    setCurPass("");setNewPass("");setConfPass("");
  };

  const tabs = isTrainer
    ? ["personal","certs","password"]
    : ["personal","password"];

  // 🔥 PERBAIKAN: Fungsi render langsung agar input stabil
  const renderInput = (k, label, ph, type="text", multiline=false) => (
    <div key={k} style={{marginBottom:12}}>
      <div style={{fontSize:11,color:T.muted,fontFamily:F.mono,letterSpacing:2,marginBottom:6}}>{label.toUpperCase()}</div>
      {multiline
        ?<textarea value={f[k] || ""} onChange={e=>s(k,e.target.value)} placeholder={ph} rows={3}
            style={{width:"100%",background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"11px 14px",color:T.text,fontSize:13,resize:"none"}}/>
        :<input type={type} value={f[k] || ""} onChange={e=>s(k,e.target.value)} placeholder={ph}
            style={{width:"100%",background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"11px 14px",color:T.text,fontSize:13}}/>
      }
    </div>
  );

  return(
    <Modal onClose={onClose}>
      <div style={{padding:"28px 24px 40px"}}>
        <div style={{fontFamily:F.display,fontSize:26,color:T.text,letterSpacing:2,marginBottom:4}}>EDIT PROFILE</div>
        <div style={{fontSize:13,color:T.muted,marginBottom:16}}>Your changes sync instantly</div>

        <div style={{display:"flex", flexDirection:"column", alignItems:"center", marginBottom:20, marginTop:10}}>
          <div style={{width:80, height:80, borderRadius:"50%", background:T.card, border:`2px solid ${accent}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:36, overflow:"hidden"}}>
            {preview.length > 10 ? <img src={preview} style={{width:"100%", height:"100%", objectFit:"cover"}} /> : preview}
          </div>
          <label style={{marginTop:8, fontSize:11, color:accent, fontWeight:700, cursor:"pointer", background:accent+"18", padding:"4px 12px", borderRadius:20, border:`1px solid ${accent}44`}}>
            CHANGE PHOTO
            <input type="file" accept="image/*" onChange={handlePhotoChange} style={{display:"none"}} />
          </label>
        </div>

        <div style={{display:"flex",gap:6,marginBottom:20}}>
          {tabs.map(t=>(
            <div key={t} className="rp" onClick={()=>setSubTab(t)} style={{flex:1,padding:"8px 4px",borderRadius:10,fontSize:10,fontWeight:700,textAlign:"center",background:subTab===t?accent:"transparent",color:subTab===t?T.bg:T.muted,border:`1px solid ${subTab===t?accent:T.border}`,cursor:"pointer",transition:"all .2s",textTransform:"uppercase",letterSpacing:.5}}>{t}</div>
          ))}
        </div>

        {subTab==="personal"&&(
          <div>
            {renderInput("name", "Full Name", "Your full name")}
            {renderInput("email", "Email", "email@example.com", "email")}
            {renderInput("phone", "Phone / WA", "+62 8xx-xxxx-xxxx", "tel")}
            {renderInput("dob", "Date of Birth", "Pilih Tanggal", "date")}
            {renderInput("address", "Address", "Street, City", "text", true)}
            {!isTrainer && renderInput("emergencyContact", "Emergency Contact", "Name (phone)")}
            {!isTrainer && (
              <div style={{marginBottom:12}}>
                <div style={{fontSize:11, color:T.muted, fontFamily:F.mono, letterSpacing:2, marginBottom:6}}>MEMBERSHIP PLAN</div>
                <div style={{display:"flex", gap:7, flexWrap:"wrap"}}>
                  {plans.map(p => (
                    <div 
                      key={p.id} 
                      className="rp" 
                      onClick={() => s("plan", p.name)} 
                      style={{
                        padding: "6px 13px", 
                        borderRadius: 10, 
                        fontSize: 11, 
                        fontWeight: 700, 
                        background: f.plan === p.name ? accent : T.card, 
                        color: f.plan === p.name ? T.bg : T.muted, 
                        border: `1px solid ${f.plan === p.name ? accent : T.border}`, 
                        cursor: "pointer",
                        transition: "all .2s"
                      }}
                    >
                      {p.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {isTrainer && renderInput("bio", "Bio", "Short bio...", "text", true)}
            {isTrainer && renderInput("ig", "Instagram", "@handle")}
            {saved&&<div style={{background:T.green+"22",border:`1px solid ${T.green}44`,borderRadius:10,padding:"9px 14px",marginBottom:12,fontSize:13,color:T.green,fontWeight:600}}>✓ Saved & synced!</div>}
            <button onClick={handleSavePersonal} style={{width:"100%",padding:14,borderRadius:12,fontFamily:F.display,fontSize:18,letterSpacing:2,background:accent,color:T.bg,fontWeight:700}}>SAVE CHANGES</button>
          </div>
        )}

        {subTab==="certs"&&isTrainer&&(
          <div>
            {renderInput("certs", "Certifications (comma separated)", "ACE, NSCA, RYT-200")}
            {renderInput("docs", "Documents & Licenses (one per line)", "ACE Certificate (2020)", "text", true)}
            <div style={{background:T.card,borderRadius:12,padding:12,marginBottom:12,border:`1px solid ${T.border}`}}>
              <div style={{fontSize:11,color:T.muted,marginBottom:8}}>CURRENT CERTS</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {f.certs.split(",").map(c=>c.trim()).filter(Boolean).map((c,i)=>(
                  <span key={i} style={{background:accent+"22",color:accent,fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:20,border:`1px solid ${accent}44`,fontFamily:F.mono}}>{c}</span>
                ))}
              </div>
            </div>
            <div style={{background:T.card,borderRadius:12,padding:12,marginBottom:16,border:`1px solid ${T.border}`}}>
              <div style={{fontSize:11,color:T.muted,marginBottom:8}}>DOCUMENTS</div>
              {f.docs.split("\n").filter(Boolean).map((d,i)=>(
                <div key={i} style={{fontSize:12,color:T.text,padding:"4px 0",borderBottom:i<f.docs.split("\n").filter(Boolean).length-1?`1px solid ${T.border}`:"none"}}>📄 {d}</div>
              ))}
            </div>
            {saved&&<div style={{background:T.green+"22",border:`1px solid ${T.green}44`,borderRadius:10,padding:"9px 14px",marginBottom:12,fontSize:13,color:T.green,fontWeight:600}}>✓ Saved & synced!</div>}
            <button onClick={handleSavePersonal} style={{width:"100%",padding:14,borderRadius:12,fontFamily:F.display,fontSize:18,letterSpacing:2,background:accent,color:T.bg,fontWeight:700}}>SAVE CERTS & DOCS</button>
          </div>
        )}

        {subTab==="password"&&(
          <div>
            {[{label:"Current Password",val:curPass,set:setCurPass},{label:"New Password",val:newPass,set:setNewPass},{label:"Confirm New Password",val:confPass,set:setConfPass}].map((pw,i)=>(
              <div key={i} style={{marginBottom:12}}>
                <div style={{fontSize:11,color:T.muted,fontFamily:F.mono,letterSpacing:2,marginBottom:6}}>{pw.label.toUpperCase()}</div>
                <input type="password" value={pw.val} onChange={e=>pw.set(e.target.value)} placeholder="••••••••"
                  style={{width:"100%",background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"11px 14px",color:T.text,fontSize:14}}/>
              </div>
            ))}
            {passMsg&&<div style={{background:passMsg.ok?T.green+"22":"#FF313122",border:`1px solid ${passMsg.ok?T.green+"44":"#FF313144"}`,borderRadius:10,padding:"9px 14px",marginBottom:12,fontSize:13,color:passMsg.ok?T.green:T.red,fontWeight:600}}>{passMsg.ok?"✓":"⚠️"} {passMsg.msg}</div>}
            <button onClick={handleChangePw} disabled={!curPass||!newPass||!confPass} style={{width:"100%",padding:14,borderRadius:12,fontFamily:F.display,fontSize:18,letterSpacing:2,background:curPass&&newPass&&confPass?accent:T.border,color:curPass&&newPass&&confPass?T.bg:T.dim,fontWeight:700}}>CHANGE PASSWORD</button>
          </div>
        )}

        <button onClick={onClose} style={{width:"100%",padding:11,borderRadius:12,background:"transparent",color:T.muted,fontSize:13,fontWeight:600,border:`1px solid ${T.border}`,marginTop:10}}>CLOSE</button>
      </div>
    </Modal>
  );
}

/* ─── EDIT CLASS MODAL (Admin — full CRUD with video link) ──── */
function EditClassModal({cls,branches,trainers,onClose,onSave,accent}){
  const [f,setF]=useState({...cls,videoUrl:cls.videoUrl||""});
  const s=(k,v)=>setF(p=>({...p,[k]:v}));
  const isOnline=f.branchId==="ONLINE";
  return(
    <Modal onClose={onClose}>
      <div style={{padding:"26px 24px 40px"}}>
        <div style={{fontFamily:F.display,fontSize:24,color:T.text,letterSpacing:2,marginBottom:4}}>EDIT CLASS</div>
        <div style={{fontSize:13,color:T.muted,marginBottom:16}}>{f.name}</div>

        {isOnline&&(
          <div style={{marginBottom:14,background:T.blue+"18",borderRadius:14,padding:14,border:`1px solid ${T.blue}44`}}>
            <div style={{fontSize:11,color:T.blue,fontFamily:F.mono,letterSpacing:2,marginBottom:8}}>🌐 VIDEO LINK (Zoom / Google Meet / YouTube)</div>
            <input value={f.videoUrl} onChange={e=>s("videoUrl",e.target.value)} placeholder="https://zoom.us/j/... or https://youtu.be/..."
              style={{width:"100%",background:T.card,border:`1px solid ${T.blue}66`,borderRadius:10,padding:"10px 12px",color:T.text,fontSize:13}}/>
            {f.videoUrl&&(
              <div style={{marginTop:8,fontSize:10,color:T.blue}}>✓ Link set — members with paid tickets will see the `&Watch;` button</div>
            )}
          </div>
        )}

        {[{k:"name",label:"Class Name",ph:"HIIT INFERNO"},{k:"time",label:"Time",ph:"06:00"},{k:"duration",label:"Duration",ph:"45 min"}].map(fi=>(
          <div key={fi.k} style={{marginBottom:12}}>
            <div style={{fontSize:11,color:T.muted,fontFamily:F.mono,letterSpacing:2,marginBottom:6}}>{fi.label.toUpperCase()}</div>
            <input value={f[fi.k]||""} onChange={e=>s(fi.k,e.target.value)} placeholder={fi.ph} style={{width:"100%",background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"11px 14px",color:T.text,fontSize:13}}/>
          </div>
        ))}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
          <div>
            <div style={{fontSize:11,color:T.muted,fontFamily:F.mono,letterSpacing:2,marginBottom:6}}>DAY</div>
            <select value={f.day} onChange={e=>s("day",e.target.value)} style={{width:"100%",background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"11px 14px",color:T.text,fontSize:13,colorScheme:"dark"}}>
              {DAYS.map(d=><option key={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <div style={{fontSize:11,color:T.muted,fontFamily:F.mono,letterSpacing:2,marginBottom:6}}>CAPACITY</div>
            <input type="number" value={f.total} onChange={e=>s("total",parseInt(e.target.value)||f.total)} style={{width:"100%",background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"11px 14px",color:T.text,fontSize:13}}/>
          </div>
        </div>
        <div style={{marginBottom:14}}>
          <div style={{fontSize:11,color:T.muted,fontFamily:F.mono,letterSpacing:2,marginBottom:6}}>TRAINER</div>
          <select value={f.trainerId} onChange={e=>s("trainerId",e.target.value)} style={{width:"100%",background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"11px 14px",color:T.text,fontSize:13,colorScheme:"dark"}}>
            {trainers.filter(t=>isOnline||t.branchId===f.branchId).map(t=><option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
        <button onClick={()=>onSave(f)} style={{width:"100%",padding:14,borderRadius:12,fontFamily:F.display,fontSize:17,letterSpacing:2,background:accent,color:T.bg,fontWeight:700,marginBottom:8}}>SAVE CHANGES</button>
        <button onClick={onClose} style={{width:"100%",padding:11,borderRadius:12,background:"transparent",color:T.muted,fontSize:13,fontWeight:600,border:`1px solid ${T.border}`}}>CANCEL</button>
      </div>
    </Modal>
  );
}

/* ─── VIDEO PLAYER MODAL (Member — watch paid online class) ─── */
function VideoPlayerModal({cls,onClose,accent}){
  const url=cls.videoUrl||"";
  // Convert YouTube watch URL to embed
  const getEmbedUrl=(u)=>{
    if(!u)return "";
    // YouTube: https://youtu.be/ID or https://www.youtube.com/watch?v=ID
    const ytMatch=u.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
    if(ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0`;
    // Google Meet, Zoom — just show link to open externally (can't iframe)
    return null;
  };
  const embedUrl=getEmbedUrl(url);
  const isYouTube=!!embedUrl;

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.96)",zIndex:200,display:"flex",flexDirection:"column"}}>
      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 20px",background:T.surface,borderBottom:`1px solid ${T.border}`,flexShrink:0}}>
        <div>
          <div style={{fontFamily:F.display,fontSize:18,color:T.text,letterSpacing:1.5,lineHeight:1}}>{cls.name}</div>
          <div style={{fontSize:11,color:T.muted,marginTop:3}}>{cls.duration} · 🌐 Virtual Class</div>
        </div>
        <div onClick={onClose} style={{width:36,height:36,borderRadius:"50%",background:T.card,border:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:T.muted,fontSize:16,flexShrink:0}}>✕</div>
      </div>
      {/* Video area */}
      <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:16}}>
        {isYouTube?(
          <div style={{width:"100%",maxWidth:390,borderRadius:16,overflow:"hidden",aspectRatio:"16/9",background:"#000"}}>
            <iframe
              src={embedUrl}
              style={{width:"100%",height:"100%",border:"none"}}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              title={cls.name}
            />
          </div>
        ):(
          <div style={{textAlign:"center",padding:24}}>
            <div style={{fontSize:48,marginBottom:16}}>🔗</div>
            <div style={{fontFamily:F.display,fontSize:22,color:T.text,letterSpacing:2,marginBottom:8}}>LIVE SESSION LINK</div>
            <div style={{fontSize:13,color:T.muted,marginBottom:20,lineHeight:1.6}}>This class uses a live session (Zoom / Google Meet). Tap the button below to join.</div>
            <div style={{background:T.card,borderRadius:12,padding:"12px 16px",marginBottom:20,border:`1px solid ${T.border}`,wordBreak:"break-all",fontSize:12,color:accent,fontFamily:F.mono}}>{url}</div>
            <button onClick={()=>{if(typeof window!=="undefined"&&window.open)window.open(url,"_blank");}}
              style={{padding:"14px 28px",borderRadius:14,fontFamily:F.display,fontSize:18,letterSpacing:2,background:accent,color:T.bg,fontWeight:700,border:"none",cursor:"pointer"}}>
              🌐 JOIN SESSION
            </button>
          </div>
        )}
      </div>
      {/* Footer info */}
      <div style={{padding:"12px 20px",background:T.surface,borderTop:`1px solid ${T.border}`,flexShrink:0}}>
        <div style={{fontSize:11,color:T.muted,textAlign:"center"}}>
          Having issues? Contact support · Class ID: {cls.id}
        </div>
      </div>
    </div>
  );
}

/* ─── PURCHASE HISTORY DETAIL MODAL (Member) ───────────────── */
function PurchaseHistoryModal({bookings,selItem,setSelItem,classes,products,branches,onClose,accent}){
  if(selItem){
    const isShop=selItem.type==="purchase";
    const relClass=!isShop?classes.find(c=>c.id===selItem.classId):null;
    const branch=selItem.branchId&&selItem.branchId!=="STORE"?branches.find(b=>b.id===selItem.branchId):null;
    return(
      <Modal onClose={()=>setSelItem(null)}>
        <div style={{padding:"28px 24px 40px"}}>
          <div onClick={()=>setSelItem(null)} style={{display:"flex",alignItems:"center",gap:8,color:T.muted,fontSize:13,cursor:"pointer",marginBottom:16,fontWeight:600}}>← Back to History</div>
          <div style={{textAlign:"center",marginBottom:20}}>
            <div style={{fontSize:56,marginBottom:8}}>{selItem.icon||"🎟️"}</div>
            <div style={{fontFamily:F.display,fontSize:24,color:T.text,letterSpacing:2,lineHeight:1}}>{selItem.className}</div>
            <div style={{fontSize:13,color:T.muted,marginTop:4}}>{isShop?"RAW Store Purchase":"Class Booking"}</div>
          </div>
          <div style={{background:T.card,borderRadius:16,padding:16,marginBottom:16,border:`1px solid ${T.border}`}}>
            {[
              {l:"Transaction ID",v:selItem.id},
              {l:"Date",          v:selItem.date},
              {l:"Time",          v:selItem.time||"—"},
              {l:"Amount",        v:`Rp ${(selItem.amount||0).toLocaleString("id")}`},
              {l:"Payment Method",v:selItem.method||"—"},
              {l:"Status",        v:selItem.paymentStatus==="verified"?"✓ Paid":selItem.paymentStatus==="pending_verification"?"⏳ Pending":"—"},
              !isShop&&{l:"Trainer",v:selItem.trainer},
              !isShop&&branch&&{l:"Branch",v:`${branch.cover} ${branch.name}`},
              isShop&&selItem.category&&{l:"Category",v:selItem.category},
            ].filter(Boolean).map((row,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",padding:"8px 0",borderBottom:`1px solid ${T.border}`}}>
                <div style={{fontSize:12,color:T.muted,flexShrink:0}}>{row.l}</div>
                <div style={{fontSize:12,fontWeight:600,color:row.l==="Status"?T.green:row.l==="Transaction ID"?accent:T.text,textAlign:"right",fontFamily:row.l==="Transaction ID"?F.mono:F.body,maxWidth:"60%",wordBreak:"break-all"}}>{row.v}</div>
              </div>
            ))}
          </div>
          {selItem.description&&(
            <div style={{background:T.card,borderRadius:12,padding:14,marginBottom:16,border:`1px solid ${T.border}`}}>
              <div style={{fontSize:11,color:T.muted,fontFamily:F.mono,letterSpacing:2,marginBottom:6}}>DESCRIPTION</div>
              <div style={{fontSize:13,color:T.text,lineHeight:1.6}}>{selItem.description}</div>
            </div>
          )}
          {selItem.status==="upcoming"&&!isShop&&(
            <div style={{background:accent+"18",borderRadius:14,padding:14,marginBottom:16,border:`1px solid ${accent}44`,textAlign:"center"}}>
              <div style={{fontSize:11,color:accent,fontFamily:F.mono,letterSpacing:2,marginBottom:8}}>YOUR TICKET BARCODE</div>
              <div style={{fontFamily:F.mono,fontSize:22,letterSpacing:6,color:accent}}>▐▌▐▌▐▌▐▌▐▌</div>
              <div style={{fontSize:10,color:T.muted,marginTop:4,fontFamily:F.mono}}>{selItem.id}</div>
            </div>
          )}
          <button onClick={()=>setSelItem(null)} style={{width:"100%",padding:14,borderRadius:12,fontFamily:F.display,fontSize:17,letterSpacing:2,background:accent,color:T.bg,fontWeight:700}}>CLOSE DETAIL</button>
        </div>
      </Modal>
    );
  }
  // List view (opened from profile)
  const sorted=[...bookings].sort((a,b)=>{
    const da=new Date(a.date),db=new Date(b.date);
    return isNaN(da)||isNaN(db)?0:db-da;
  });
  return(
    <Modal onClose={onClose}>
      <div style={{padding:"28px 24px 40px"}}>
        <div style={{fontFamily:F.display,fontSize:26,color:T.text,letterSpacing:2,marginBottom:4}}>PURCHASE HISTORY</div>
        <div style={{fontSize:13,color:T.muted,marginBottom:16}}>{bookings.length} transactions total</div>
        {bookings.length===0?<Empty icon="💳" title="NO TRANSACTIONS" sub="Your purchases will appear here"/>:
          sorted.map((b,i)=>(
            <div key={b.id} className="rp fu" onClick={()=>setSelItem(b)}
              style={{animationDelay:`${i*.04}s`,display:"flex",gap:12,alignItems:"center",padding:"12px 0",borderBottom:`1px solid ${T.border}`,cursor:"pointer"}}>
              <div style={{width:42,height:42,borderRadius:12,background:b.type==="purchase"?T.lime+"22":accent+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{b.icon||"🎟️"}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:700,fontSize:13,color:T.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{b.className}</div>
                <div style={{fontSize:11,color:T.muted,marginTop:1}}>{b.date}</div>
              </div>
              <div style={{textAlign:"right",flexShrink:0}}>
                <div style={{fontSize:13,fontWeight:700,color:b.type==="purchase"?T.lime:accent}}>Rp {(b.amount||0).toLocaleString("id")}</div>
                <div style={{fontSize:10,color:b.paymentStatus==="verified"?T.green:T.yellow,fontFamily:F.mono}}>{b.paymentStatus==="verified"?"PAID":"PENDING"}</div>
              </div>
            </div>
          ))
        }
        <button onClick={onClose} style={{width:"100%",padding:12,borderRadius:12,background:"transparent",color:T.muted,fontSize:14,fontWeight:600,border:`1px solid ${T.border}`,marginTop:16}}>CLOSE</button>
      </div>
    </Modal>
  );
}

/* ─── ACHIEVEMENTS MODAL (Member) ──────────────────────────── */
function AchievementsModal({user,bookings,badges,onClose,accent}){
  // 1. Definisikan data dasar
  const classBookings = (bookings || []).filter(b=>b.type!=="purchase"&&b.paymentStatus==="verified");
  const purchaseCount = (bookings || []).filter(b=>b.type==="purchase"&&b.paymentStatus==="verified").length;
  const uniqueBranches = new Set(classBookings.map(b => b.branchId)).size;

  // 2. Definisikan Rule Engine
  const evaluateBadge = (b) => {
    switch(b.ruleType) {
      case "class_count": return classBookings.length >= b.targetValue;
      case "streak": return (user.streak||0) >= b.targetValue;
      case "months": return getMonthsActive(user.joinDate) >= b.targetValue;
      case "purchase_count": return purchaseCount >= b.targetValue;
      case "branch_count": return uniqueBranches >= b.targetValue;
      default: return false;
    }
  };

  // 3. Hitung Badge yang didapat (Definisikan 'earned' di sini)
  const evaluatedBadges = (badges || []).map(b => ({...b, done: evaluateBadge(b)}));
  const earned = evaluatedBadges.filter(b=>b.done).length;
  const total = (badges || []).length;

  return(
    <Modal onClose={onClose}>
      <div style={{padding:"28px 24px 40px"}}>
        <div style={{fontFamily:F.display,fontSize:26,color:T.text,letterSpacing:2,marginBottom:4}}>ACHIEVEMENTS</div>
        <div style={{fontSize:13,color:T.muted,marginBottom:6}}>{earned} of {total} badges earned</div>
        
        {/* Progress bar menggunakan variabel 'earned' yang sudah didefinisikan di atas */}
        <div style={{height:5,background:T.border,borderRadius:4,overflow:"hidden",marginBottom:20}}>
          <div style={{width:`${total===0?0:(earned/total)*100}%`,height:"100%",background:`linear-gradient(90deg,${accent},${T.lime})`,borderRadius:4,transition:"width 1s"}}/>
        </div>
        
        {total===0 ? <Empty icon="🏆" title="NO BADGES" sub="Admin hasn't created any badges yet"/> : (
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {evaluatedBadges.map((b,i)=>(
              <div key={b.id} className="fu" style={{animationDelay:`${i*.04}s`,background:b.done?accent+"18":T.card,borderRadius:14,padding:14,border:`1px solid ${b.done?accent+"44":T.border}`,opacity:b.done?1:0.5,textAlign:"center"}}>
                <div style={{fontSize:32,marginBottom:6,filter:b.done?"none":"grayscale(1)"}}>{b.icon}</div>
                <div style={{fontWeight:700,fontSize:13,color:b.done?T.text:T.muted,marginBottom:4,lineHeight:1.1}}>{b.name}</div>
                <div style={{fontSize:10,color:T.muted,lineHeight:1.4}}>{b.desc}</div>
                {b.done&&<div style={{marginTop:6,fontSize:10,color:accent,fontWeight:700,fontFamily:F.mono}}>✓ EARNED</div>}
              </div>
            ))}
          </div>
        )}
        <button onClick={onClose} style={{width:"100%",padding:13,borderRadius:12,fontFamily:F.display,fontSize:17,letterSpacing:2,background:accent,color:T.bg,fontWeight:700,marginTop:20}}>CLOSE</button>
      </div>
    </Modal>
  );
}

/* ─── HELP & SUPPORT MODAL (Member → create & view tickets) ── */
function HelpSupportModal({tickets,onSubmit,onClose,accent,sendReply}){
  const [view,setView]=useState("list"); // list | new
  const [subject,setSubject]=useState("");
  const [message,setMessage]=useState("");
  const [sent,setSent]=useState(false);

  const handleSubmit=()=>{
    if(!subject.trim()||!message.trim())return;
    onSubmit(subject,message);
    setSent(true);
    setTimeout(()=>{setSubject("");setMessage("");setSent(false);setView("list");},1500);
  };

  const statusColor=(s)=>s==="open"?T.yellow:s==="replied"?T.green:T.muted;

  return(
    <Modal onClose={onClose}>
      <div style={{padding:"28px 24px 40px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <div style={{fontFamily:F.display,fontSize:24,color:T.text,letterSpacing:2}}>HELP & SUPPORT</div>
          <div onClick={onClose} style={{width:34,height:34,borderRadius:"50%",background:T.card,border:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:T.muted,fontSize:14}}>✕</div>
        </div>
        {/* Tabs */}
        <div style={{display:"flex",gap:7,marginBottom:18}}>
          {[{v:"list",l:`My Tickets (${tickets.length})`},{v:"new",l:"+ New Ticket"}].map(t=>(
            <div key={t.v} className="rp" onClick={()=>setView(t.v)} style={{flex:1,padding:"9px",borderRadius:12,fontSize:12,fontWeight:700,textAlign:"center",background:view===t.v?accent:"transparent",color:view===t.v?T.bg:T.muted,border:`1px solid ${view===t.v?accent:T.border}`,cursor:"pointer",transition:"all .2s"}}>{t.l}</div>
          ))}
        </div>

        {view==="list"&&(
          tickets.length===0?<Empty icon="💬" title="NO TICKETS" sub="Submit a ticket if you need help"/>:
          tickets.map((t,i)=>(
            <div key={t.id} className="fu" style={{animationDelay:`${i*.04}s`,background:T.card,borderRadius:14,padding:14,marginBottom:10,border:`1px solid ${statusColor(t.status)}44`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                <div style={{fontWeight:700,color:T.text,fontSize:13,flex:1,marginRight:8}}>{t.subject}</div>
                <div style={{padding:"2px 8px",borderRadius:20,fontSize:9,fontWeight:700,fontFamily:F.mono,background:statusColor(t.status)+"22",color:statusColor(t.status),border:`1px solid ${statusColor(t.status)}44`,flexShrink:0,textTransform:"uppercase"}}>{t.status}</div>
              </div>
              <div style={{fontSize:12,color:T.muted,marginBottom:8,lineHeight:1.5}}>{t.message}</div>
              {t.replies.length>0&&t.replies.map((r,j)=>(
                <div key={j} style={{background:r.from==="admin"?T.green+"18":T.cardHi,borderRadius:10,padding:"8px 12px",marginTop:6,borderLeft:`2px solid ${r.from==="admin"?T.green:accent}`,fontSize:12,color:T.text,lineHeight:1.5}}>
                  <div style={{fontSize:10,color:r.from==="admin"?T.green:accent,fontWeight:700,marginBottom:3,fontFamily:F.mono}}>{r.from==="admin"?"RAW SUPPORT":"YOU"}</div>
                  {r.text}
                </div>
              ))}
              {t.status !== "closed" && (
                <div style={{display:"flex", gap:8, marginTop:12, paddingTop:12, borderTop:`1px solid ${T.border}`}}>
                  <input 
                    id={`reply-member-${t.id}`}
                    placeholder="Balas pesan..." 
                    style={{flex:1, background:T.bg, border:`1px solid ${T.border}`, color:T.text, padding:8, borderRadius:8, fontSize:12}}
                  />
                  <button onClick={async () => {
                    const inp = document.getElementById(`reply-member-${t.id}`);
                    if(inp.value.trim()) {
                      const ok = await sendReply(t.id, inp.value, "member");
                      if(ok) inp.value = "";
                    }
                  }} style={{background:accent, color:T.bg, padding:"0 12px", borderRadius:8, fontWeight:700, fontSize:11}}>KIRIM</button>
                </div>
              )}
              <div style={{fontSize:10,color:T.dim,marginTop:6,fontFamily:F.mono}}>{new Date(t.date).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})}</div>
            </div>
          ))
        )}

        {view==="new"&&(
          sent?(
            <div style={{textAlign:"center",padding:"30px 0"}}>
              <div className="pi" style={{fontSize:60,marginBottom:12}}>✅</div>
              <div style={{fontFamily:F.display,fontSize:22,color:T.green,letterSpacing:2}}>TICKET SUBMITTED!</div>
              <div style={{fontSize:13,color:T.muted,marginTop:6}}>Our team will respond within 24 hours.</div>
            </div>
          ):(
            <>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:11,color:T.muted,fontFamily:F.mono,letterSpacing:2,marginBottom:6}}>SUBJECT</div>
                <input value={subject} onChange={e=>setSubject(e.target.value)} placeholder="e.g. Locker issue, Billing question..."
                  style={{width:"100%",background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"11px 14px",color:T.text,fontSize:13}}/>
              </div>
              <div style={{marginBottom:18}}>
                <div style={{fontSize:11,color:T.muted,fontFamily:F.mono,letterSpacing:2,marginBottom:6}}>MESSAGE</div>
                <textarea value={message} onChange={e=>setMessage(e.target.value)} placeholder="Describe your issue in detail..." rows={5}
                  style={{width:"100%",background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"11px 14px",color:T.text,fontSize:13,resize:"none"}}/>
              </div>
              <button onClick={handleSubmit} disabled={!subject.trim()||!message.trim()}
                style={{width:"100%",padding:14,borderRadius:12,fontFamily:F.display,fontSize:17,letterSpacing:2,background:subject&&message?accent:T.border,color:subject&&message?T.bg:T.dim,fontWeight:700}}>
                SEND TO SUPPORT
              </button>
            </>
          )
        )}
      </div>
    </Modal>
  );
}

/* ─── ADMIN SUPPORT INBOX (Admin — view & reply to tickets) ── */
function AdminSupportInbox({tickets,users,onReply,onClose,onCloseTicket,accent}){
  const [selTicket,setSelTicket]=useState(null);
  const [reply,setReply]=useState("");

  const handleReply=()=>{
    if(!reply.trim())return;
    onReply(selTicket.id,reply);
    setReply("");
    // Update local view
    setSelTicket(prev=>({...prev,status:"replied",replies:[...(Array.isArray(prev.replies) ? prev.replies : []),{from:"admin",text:reply,time:new Date()}]}));
  };

  const statusColor=(s)=>s==="open"?T.yellow:s==="replied"?T.green:T.muted;

  if(selTicket) return(
    <Modal onClose={()=>setSelTicket(null)}>
      <div style={{padding:"28px 24px 40px"}}>
        <div onClick={()=>setSelTicket(null)} style={{display:"flex",alignItems:"center",gap:8,color:T.muted,fontSize:13,cursor:"pointer",marginBottom:16,fontWeight:600}}>← Back to Inbox</div>
        <div style={{fontFamily:F.display,fontSize:20,color:T.text,letterSpacing:1.5,marginBottom:4}}>{selTicket.subject}</div>
        <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:16}}>
          <span style={{fontSize:12,color:T.muted}}>from <b style={{color:T.text}}>{selTicket.userName}</b></span>
          <span style={{padding:"2px 8px",borderRadius:20,fontSize:9,fontWeight:700,fontFamily:F.mono,background:statusColor(selTicket.status)+"22",color:statusColor(selTicket.status),border:`1px solid ${statusColor(selTicket.status)}44`,textTransform:"uppercase"}}>{selTicket.status}</span>
        </div>
        {/* Original message */}
        <div style={{background:T.card,borderRadius:12,padding:14,marginBottom:12,border:`1px solid ${T.border}`,borderLeft:`3px solid ${T.cyan}`,fontSize:13,color:T.text,lineHeight:1.6}}>{selTicket.message}</div>
        {/* Replies */}
        {selTicket.replies.map((r,i)=>(
          <div key={i} style={{background:r.from==="admin"?T.green+"18":T.cardHi,borderRadius:12,padding:12,marginBottom:8,borderLeft:`3px solid ${r.from==="admin"?T.green:T.cyan}`,fontSize:13,color:T.text,lineHeight:1.6}}>
            <div style={{fontSize:10,color:r.from==="admin"?T.green:T.cyan,fontWeight:700,marginBottom:4,fontFamily:F.mono}}>{r.from==="admin"?"RAW SUPPORT":"MEMBER"} · {new Date(r.time).toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"})}</div>
            {r.text}
          </div>
        ))}
        {/* Reply box */}
        {selTicket.status!=="closed"&&(
          <>
            <textarea value={reply} onChange={e=>setReply(e.target.value)} placeholder="Type your reply..." rows={3}
              style={{width:"100%",background:T.card,border:`1px solid ${accent}`,borderRadius:12,padding:"10px 14px",color:T.text,fontSize:13,resize:"none",marginBottom:10}}/>
            <div style={{display:"flex",gap:8}}>
              <button onClick={handleReply} disabled={!reply.trim()} style={{flex:1,padding:12,borderRadius:12,fontFamily:F.display,fontSize:16,letterSpacing:1,background:reply.trim()?T.green:T.border,color:reply.trim()?T.bg:T.dim,fontWeight:700}}>SEND REPLY</button>
              <button onClick={()=>onCloseTicket(selTicket.id)} style={{padding:"12px 16px",borderRadius:12,fontSize:12,fontWeight:700,background:"#FF313122",color:T.red,border:"1px solid #FF313144",cursor:"pointer"}}>CLOSE TICKET</button>
            </div>
          </>
        )}
        {selTicket.status==="closed"&&<div style={{textAlign:"center",padding:"12px 0",fontSize:13,color:T.muted}}>This ticket is closed.</div>}
      </div>
    </Modal>
  );

  return(
    <Modal onClose={onClose}>
      <div style={{padding:"28px 24px 40px"}}>
        <div style={{fontFamily:F.display,fontSize:24,color:T.text,letterSpacing:2,marginBottom:4}}>SUPPORT INBOX</div>
        <div style={{fontSize:13,color:T.muted,marginBottom:16}}>{tickets.length} tickets total · {tickets.filter(t=>t.status==="open").length} open</div>
        {tickets.length===0?<Empty icon="💬" title="NO TICKETS" sub="Member support tickets will appear here"/>:
          tickets.map((t,i)=>(
            <div key={t.id} className="fu rp" onClick={()=>setSelTicket(t)}
              style={{animationDelay:`${i*.04}s`,background:T.card,borderRadius:14,padding:14,marginBottom:10,border:`1px solid ${statusColor(t.status)}44`,cursor:"pointer"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8,marginBottom:6}}>
                <div style={{fontWeight:700,color:T.text,fontSize:13,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.subject}</div>
                <div style={{padding:"2px 8px",borderRadius:20,fontSize:9,fontWeight:700,fontFamily:F.mono,background:statusColor(t.status)+"22",color:statusColor(t.status),border:`1px solid ${statusColor(t.status)}44`,flexShrink:0,textTransform:"uppercase"}}>{t.status}</div>
              </div>
              <div style={{fontSize:11,color:T.cyan,marginBottom:4}}>👤 {t.userName}</div>
              <div style={{fontSize:12,color:T.muted,lineHeight:1.4,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{t.message}</div>
              <div style={{fontSize:10,color:T.dim,marginTop:6,fontFamily:F.mono}}>{new Date(t.date).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})}</div>
            </div>
          ))
        }
        <button onClick={onClose} style={{width:"100%",padding:12,borderRadius:12,background:"transparent",color:T.muted,fontSize:14,fontWeight:600,border:`1px solid ${T.border}`,marginTop:8}}>CLOSE</button>
      </div>
    </Modal>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SHARED PRIMITIVES
═══════════════════════════════════════════════════════════════ */
function Modal({children,onClose}){
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",zIndex:100,display:"flex",alignItems:"flex-end",justifyContent:"center",backdropFilter:"blur(12px)"}} onClick={e=>e.target===e.currentTarget&&onClose&&onClose()}>
      <div className="su" style={{background:T.surface,borderRadius:"24px 24px 0 0",width:"100%",maxWidth:430,maxHeight:"92vh",overflowY:"auto",border:`1px solid ${T.border}`,borderBottom:"none"}}>
        {children}
      </div>
    </div>
  );
}

function BNav({items,active,onChange,accent,rightSlot}){
  return(
    <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:T.surface+"F8",borderTop:`1px solid ${T.border}`,display:"flex",paddingTop:8,paddingBottom:"max(16px,env(safe-area-inset-bottom))",zIndex:50,backdropFilter:"blur(20px)",alignItems:"flex-start"}}>
      {items.map(it=>(
        <div key={it.id} className="rp" onClick={()=>onChange(it.id)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,cursor:"pointer",paddingTop:2,paddingBottom:2,position:"relative",minWidth:0}}>
          {(it.badge>0)&&<div style={{position:"absolute",top:0,right:"calc(50% - 18px)",background:T.red,color:"#fff",fontSize:8,fontWeight:700,minWidth:15,height:15,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:F.mono,lineHeight:1}}>{it.badge>9?"9+":it.badge}</div>}
          <div style={{fontSize:active===it.id?22:19,lineHeight:1,transform:active===it.id?"translateY(-2px)":"none",transition:"all .2s",filter:active===it.id?"none":"grayscale(0.5) opacity(0.5)"}}>{it.icon}</div>
          <div style={{fontSize:9,fontWeight:active===it.id?700:400,color:active===it.id?accent:T.dim,letterSpacing:.3,transition:"all .2s",lineHeight:1}}>{it.label}</div>
          {active===it.id&&<div style={{width:4,height:4,borderRadius:"50%",background:accent}}/>}
        </div>
      ))}
    </div>
  );
}

function RoleBadge({role,small}){
  const cfg={member:{color:T.cyan,icon:"💪",label:"MEMBER"},admin:{color:T.orange,icon:"🛡️",label:"SUPER ADMIN"},trainer:{color:T.lime,icon:"🏋️",label:"TRAINER"}}[role];
  return(
    <div style={{display:"inline-flex",alignItems:"center",gap:5,background:cfg.color+"18",border:`1px solid ${cfg.color}44`,borderRadius:20,padding:small?"3px 8px":"5px 12px"}}>
      <span style={{fontSize:small?11:13}}>{cfg.icon}</span>
      <span style={{fontSize:small?9:10,fontWeight:700,color:cfg.color,letterSpacing:2,fontFamily:F.mono}}>{cfg.label}</span>
    </div>
  );
}

function DaySel({selDate, setSelDate, accent}){
  return(
    <div style={{display:"flex",gap:7,overflowX:"auto",paddingBottom:4,marginTop:10}}>
      {DYNAMIC_DAYS.map((d,i)=>(
        <div key={i} className="rp" onClick={()=>setSelDate(d)} style={{minWidth:55,height:62,borderRadius:13,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2,background:selDate.fullDate===d.fullDate?accent:T.card,border:`1px solid ${selDate.fullDate===d.fullDate?accent:T.border}`,cursor:"pointer",transition:"all .2s"}}>
          <div style={{fontSize:10,fontWeight:700,color:selDate.fullDate===d.fullDate?T.bg:T.muted}}>{d.dayName}</div>
          <div style={{fontSize:17,fontFamily:F.display,color:selDate.fullDate===d.fullDate?T.bg:T.text,letterSpacing:1}}>{d.dateNum}</div>
        </div>
      ))}
    </div>
  );
}

function ClassCard({cls,onBook,delay=0}){
  const pct=Math.round(((cls.total-cls.slots)/cls.total)*100);
  const full=cls.slots===0,cancel=cls.status==="cancelled";
  const isOnline=cls.branchId==="ONLINE";
  const accent=isOnline?T.blue:cls.color;
  const hasVideo=isOnline&&cls.videoUrl;

  return(
    <div className="fu" style={{animationDelay:`${delay}s`,background:T.card,borderRadius:16,padding:14,marginBottom:11,border:`1px solid ${cancel?"#FF313144":isOnline?T.blue+"44":T.border}`,overflow:"hidden",position:"relative",opacity:cancel?.55:1}}>
      <div style={{position:"absolute",top:0,left:0,width:`${pct}%`,height:2,background:accent}}/>
      {cancel&&<div style={{position:"absolute",top:10,right:10,background:"#FF313118",color:T.red,fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:8,fontFamily:F.mono}}>CANCELED</div>}
      <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
        <div style={{width:46,height:46,borderRadius:13,background:accent+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0,border:`1px solid ${accent}44`}}>{cls.icon}</div>
        <div style={{flex:1,minWidth:0}}>
          {/* Name row */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:6,marginBottom:2}}>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontFamily:F.display,fontSize:17,color:T.text,letterSpacing:1.2,lineHeight:1.1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                {cls.name}{isOnline?" 🌐":""}
              </div>
              <div style={{fontSize:11,color:T.muted,marginTop:2}}>{cls.duration}</div>
            </div>
            <div style={{textAlign:"right",flexShrink:0}}>
              <div style={{fontFamily:F.display,fontSize:18,color:accent,letterSpacing:1}}>{cls.time}</div>
              <div style={{fontSize:9,fontWeight:700,padding:"2px 6px",borderRadius:8,fontFamily:F.mono,background:cls.intensity==="HIGH"?"#FF313118":cls.intensity==="MED"?"#FF5C0018":"#00FF8518",color:cls.intensity==="HIGH"?T.red:cls.intensity==="MED"?T.orange:T.green,marginTop:2,letterSpacing:.5}}>{cls.intensity}</div>
            </div>
          </div>
          {/* Progress + action row */}
          {!cancel&&(
            <div style={{display:"flex",alignItems:"center",gap:8,marginTop:8}}>
              <div style={{flex:1,height:3,background:T.border,borderRadius:4,overflow:"hidden",minWidth:20}}>
                <div style={{width:`${pct}%`,height:"100%",background:accent,borderRadius:4}}/>
              </div>
              <div style={{fontSize:10,color:full?T.red:T.muted,fontWeight:700,flexShrink:0}}>{full?"FULL":`${cls.slots}`}</div>
              <button onClick={onBook} disabled={full&&!hasVideo}
                style={{flexShrink:0,padding:"6px 12px",borderRadius:10,fontSize:11,fontWeight:700,background:hasVideo?T.blue:full?T.border:accent,color:hasVideo||!full?T.bg:T.dim,border:"none",cursor:full&&!hasVideo?"default":"pointer",letterSpacing:.3}}>
                {hasVideo?"▶ WATCH":full?"FULL":"BOOK"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TicketCard({b,accent,delay=0}){
  const isPending = b.paymentStatus === "pending_verification";
  const cardAccent = isPending ? T.yellow : accent;

  return(
    <div className="fu" style={{animationDelay:`${delay}s`,background:T.card,borderRadius:18,padding:15,marginBottom:11,border:`1px solid ${b.status==="upcoming"?cardAccent+"44":T.border}`,position:"relative",overflow:"hidden"}}>
      {b.status==="upcoming"&&<div style={{position:"absolute",top:0,left:0,right:0,height:2,background:cardAccent}}/>}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
        <div>
          <div style={{fontFamily:F.display,fontSize:19,color:T.text,letterSpacing:1.5}}>{b.className}</div>
          <div style={{fontSize:12,color:T.muted,marginTop:2}}>{b.trainer}</div>
        </div>
        <div style={{padding:"3px 9px",borderRadius:20,fontSize:10,fontWeight:700,fontFamily:F.mono,background:b.status==="upcoming"?cardAccent+"22":T.border,color:b.status==="upcoming"?cardAccent:T.muted,border:`1px solid ${b.status==="upcoming"?cardAccent+"44":T.border}`}}>
          {b.status==="upcoming"?(isPending?"PENDING":"ACTIVE"):"DONE"}
        </div>
      </div>
      <div style={{display:"flex",gap:14,paddingBottom:b.status==="upcoming"?11:0,borderBottom:b.status==="upcoming"?`1px dashed ${T.border}`:"none"}}>
        {[{l:"DATE",v:b.date},{l:"TIME",v:b.time},{l:"ID",v:b.id}].map((f,i)=>(
          <div key={i}>
            <div style={{fontSize:9,color:T.dim,fontFamily:F.mono,letterSpacing:1}}>{f.l}</div>
            <div style={{fontSize:11,fontWeight:700,color:i===2?cardAccent:T.text,marginTop:2,fontFamily:i===2?F.mono:F.body}}>{f.v}</div>
          </div>
        ))}
      </div>
      {b.status==="upcoming"&&<div style={{marginTop:11,display:"flex",justifyContent:"center"}}>
        <div style={{background:T.bg,borderRadius:10,padding:"9px 15px",fontFamily:F.mono,fontSize:18,letterSpacing:5,color:cardAccent}}>▐▌▐▌▐▌▐▌▐▌</div>
      </div>}
    </div>
  );
}

function Chip({color,text}){return <span style={{background:color+"22",color,fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:20,border:`1px solid ${color}44`,fontFamily:F.mono,letterSpacing:1}}>{text}</span>;}
function SecTitle({title,size=20}){return <div style={{fontFamily:F.display,fontSize:size,color:T.text,letterSpacing:2,marginBottom:12}}>{title}</div>;}
function StatBlock({label,val,color}){return <div style={{flex:1,background:T.card,borderRadius:14,padding:13,border:`1px solid ${T.border}`,textAlign:"center"}}><div style={{fontFamily:F.display,fontSize:26,color,letterSpacing:2}}>{val}</div><div style={{fontSize:12,color:T.muted}}>{label}</div></div>;}
function MenuIt({icon,label,sub,badge}){
  return(
    <div className="rp" style={{background:T.card,borderRadius:14,padding:"13px 15px",marginBottom:8,border:`1px solid ${T.border}`,display:"flex",alignItems:"center",gap:13,cursor:"pointer",position:"relative"}}>
      <div style={{width:40,height:40,borderRadius:12,background:T.surface,display:"flex",alignItems:"center",justifyContent:"center",fontSize:19,flexShrink:0}}>{icon}</div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontWeight:600,color:T.text,fontSize:13}}>{label}</div>
        {sub&&<div style={{fontSize:11,color:T.muted,marginTop:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{sub}</div>}
      </div>
      {badge>0&&<div style={{background:T.red,color:"#fff",fontSize:10,fontWeight:700,minWidth:20,height:20,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:F.mono,flexShrink:0}}>{badge}</div>}
      <div style={{color:T.dim,fontSize:17,flexShrink:0}}>›</div>
    </div>
  );
}
function Empty({icon,title,sub}){return <div style={{textAlign:"center",padding:"40px 0"}}><div style={{fontSize:44,marginBottom:10}}>{icon}</div><div style={{fontFamily:F.display,fontSize:18,letterSpacing:2,color:T.dim}}>{title}</div><div style={{fontSize:12,color:T.muted,marginTop:4}}>{sub}</div></div>;}

/* ═══════════════════════════════════════════════════════════════
   ANDROID APK INSTALL BANNER
═══════════════════════════════════════════════════════════════ */
function AndroidInstallBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Deteksi apakah perangkat adalah Android
    const isAndroid = /android/i.test(navigator.userAgent);
    
    // Deteksi apakah sedang jalan di dalam App Native (Capacitor/PWA)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    const isCapacitor = !!window.Capacitor?.isNative;
    
    // Cek apakah user sudah pernah menutup banner ini sebelumnya
    const isDismissed = localStorage.getItem('hide_apk_banner') === 'true';

    // Munculkan hanya di Web Browser Android
    if (isAndroid && !isStandalone && !isCapacitor && !isDismissed) {
      // Delay sedikit agar animasinya terlihat mulus setelah web loading
      setTimeout(() => setShow(true), 1000);
    }
  }, []);

  if (!show) return null;

  return (
    <div className="su" style={{position:"fixed", top: 16, left:"50%", transform:"translateX(-50%)", width:"calc(100% - 32px)", maxWidth:398, background:T.cardHi, border:`1px solid ${T.lime}66`, borderRadius:16, padding:"12px 14px", zIndex:9999, display:"flex", alignItems:"center", gap:12, boxShadow:`0 8px 32px rgba(0,0,0,0.6)`}}>
      <div style={{width:40, height:40, borderRadius:10, background:T.lime+"22", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, flexShrink:0}}>⚡</div>
      <div style={{flex:1, minWidth:0}}>
        <div style={{fontWeight:700, color:T.text, fontSize:13}}>RAW Gym App</div>
        <div style={{fontSize:11, color:T.muted, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis"}}>Faster & better experience</div>
      </div>
      
      {/* 🟢 TOMBOL DOWNLOAD MENGARAH KE FILE APK */}
      <a href="/raw-gym.apk" download style={{background:T.lime, color:T.bg, padding:"8px 14px", borderRadius:10, fontSize:11, fontWeight:700, textDecoration:"none", flexShrink:0, boxShadow:`0 4px 14px ${T.lime}44`}}>
        INSTALL
      </a>
      
      <div onClick={() => { localStorage.setItem('hide_apk_banner', 'true'); setShow(false); }} style={{color:T.muted, padding:"4px", fontSize:16, cursor:"pointer", flexShrink:0}}>✕</div>
    </div>
  );
}