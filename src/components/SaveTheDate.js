import React from "react";
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

const formatForCal = (iso) => { const d = new Date(iso); const pad = (n) => String(n).padStart(2,"0"); return d.getUTCFullYear()+pad(d.getUTCMonth()+1)+pad(d.getUTCDate())+"T"+pad(d.getUTCHours())+pad(d.getUTCMinutes())+pad(d.getUTCSeconds())+"Z"; };
const buildEvent = ({startISO,endISO,title,description,location}) => ({start:formatForCal(startISO),end:formatForCal(endISO),title,description,location});
const googleUrl = (e) => `https://calendar.google.com/calendar/render?${new URLSearchParams({action:"TEMPLATE",text:e.title,dates:`${e.start}/${e.end}`,details:e.description,location:e.location})}`;
const buildIcs = (e) => ["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Filmar & Rochelle//EN","CALSCALE:GREGORIAN","BEGIN:VEVENT",`UID:fr-${e.start}@wedding`,`DTSTAMP:${formatForCal(new Date().toISOString())}`,`DTSTART:${e.start}`,`DTEND:${e.end}`,`SUMMARY:${e.title}`,`DESCRIPTION:${e.description}`,`LOCATION:${e.location}`,"END:VEVENT","END:VCALENDAR"].join("\r\n");
const downloadIcs = (e) => { const blob = new Blob([buildIcs(e)],{type:"text/calendar;charset=utf-8"}); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href=url; a.download="filmar-rochelle-wedding.ics"; a.click(); URL.revokeObjectURL(url); };
const Option = ({label,sublabel,onClick,testid}) => (<DropdownMenuItem onClick={onClick} className="cursor-pointer px-4 py-3" data-testid={testid}><div><div className="font-serif-display text-base text-[#2B2824]">{label}</div><div className="text-[10px] tracking-[0.2em] uppercase text-[#857F76] mt-0.5">{sublabel}</div></div></DropdownMenuItem>);

export const SaveTheDate = ({ startISO, durationHours=4 }) => {
  const endISO = new Date(new Date(startISO).getTime()+durationHours*60*60*1000).toISOString();
  const event = buildEvent({startISO,endISO,title:"Filmar & Rochelle's Wedding Reception",description:"Reception begins at 6:00 PM — arrival from 5:30 PM. Semi-formal attire.",location:"Bardot Room, Ibis Styles Manila Araneta City, Quezon City"});
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="inline-flex items-center justify-center gap-2 px-8 sm:px-10 py-4 bg-transparent border border-[#2B2824] text-[#2B2824] text-xs tracking-[0.35em] uppercase hover:bg-[#2B2824] hover:text-[#FDFBF7] transition-all duration-500 cursor-pointer" data-testid="save-the-date-trigger">
          <CalendarIcon size={14} strokeWidth={1.5} />Save the date<ChevronDown size={12} strokeWidth={1.5} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="bg-white border border-[#E5E1D8] min-w-[260px] p-0 rounded-none shadow-md" data-testid="save-the-date-menu">
        <div className="px-4 py-3 border-b border-[#E5E1D8] bg-[#FBF7F2]"><p className="text-[10px] tracking-[0.3em] uppercase text-[#857F76]">Add to calendar</p></div>
        <Option label="Google Calendar" sublabel="Opens in a new tab" onClick={() => window.open(googleUrl(event),"_blank","noopener")} testid="cal-option-google" />
        <Option label="Apple Calendar" sublabel="Downloads .ics file" onClick={() => downloadIcs(event)} testid="cal-option-apple" />
        <Option label="Other / Download" sublabel=".ics works everywhere" onClick={() => downloadIcs(event)} testid="cal-option-ics" />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SaveTheDate;
