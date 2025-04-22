import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Message } from "@/types";


const messages: Message[] = [
    { id: 1, sender: "Kelly", role: "patient", time: "08:23", text: "Hello John, how are you feeling today?", avatar: "/avatars/patient.png" },
    { id: 2, sender: "Doctor William", role: "doctor", time: "08:23", text: "I've been having mild headaches for the past few days.", avatar: "/avatars/doctor.png" },
    { id: 3, sender: "Kelly", role: "patient", time: "08:23", text: "No dizziness, no nausea. It just feels worse at night", avatar: "/avatars/patient.png" },
    { id: 4, sender: "Doctor William", role: "doctor", time: "08:23", text: "I see. Have you noticed any other symptoms?", avatar: "/avatars/doctor.png" },
    { id: 5, sender: "Kelly", role: "patient", time: "08:23", text: "Hello John, how are you feeling today?", avatar: "/avatars/patient.png" },
    { id: 6, sender: "Doctor William", role: "doctor", time: "08:23", text: "Understood. Are you taking any medication for it?", avatar: "/avatars/doctor.png" },
    { id: 7, sender: "Kelly", role: "patient", time: "08:23", text: "No, just drinking more water and resting.", avatar: "/avatars/patient.png" },
    { id: 8, sender: "Doctor William", role: "doctor", time: "08:23", text: "Good. Let’s check your vitals.", avatar: "/avatars/doctor.png" },
    { id: 9, sender: "Kelly", role: "patient", time: "08:23", text: "Okay, thank you, doctor.", avatar: "/avatars/patient.png" },
    { id: 10, sender: "Doctor William", role: "doctor", time: "08:23", text: "Your blood pressure is normal. No signs of fever.", avatar: "/avatars/doctor.png" },
];

export default function ChatComponent() {
    return (
        <div>
            {messages.map((msg) => (
                <div
                    key={msg.id}
                    className={`flex items-start gap-3 p-3  ${msg.role === "doctor" ? "justify-start" : "justify-end"} `}
                >

                    <div className="flex flex-col gap-[7px]">
                        <div className={`flex items-center ${msg.role=="doctor"?'justif-start':'justify-end'} gap-[10px]`}>
                          
                                <Avatar>
                                    <AvatarImage src={msg.avatar} alt={msg.role} />
                                    <AvatarFallback>{msg.role=="doctor"?'Dr':'Pa'}</AvatarFallback>
                                </Avatar>
                          
                            <p className=" font-normal text-[16px] leading-[26px] text-[#919AB4]">
                                {msg.sender} <span >{msg.time}</span>
                            </p>
                        </div>
                        <p className="text-gray-800 mt-[7px]  max-w-sm">{msg.text}</p>
                    </div>

                </div>
            ))}
        </div>
    );
}
