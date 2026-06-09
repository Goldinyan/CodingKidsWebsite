import type { Theme } from "@/context/ThemeContext";
import type { Mentor } from "@/BackEnd/type";
import { Github, Instagram, Linkedin, Twitter } from "lucide-react";

export type SimpleMentorCardProps = Mentor & {
  onExpand?: () => void;
  isFirst?: boolean;
  isExpanded?: boolean;
  theme: Theme;
  isRounded: boolean;
};

export function SimpleMentorCard({ props }: { props: SimpleMentorCardProps }) {
  console.log(props);

  return (
    <div
      className={`bg-white w-full h-full dark:bg-white/5 backdrop-blur-2xl p-6 border border-zinc-200 dark:border-zinc-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col ${
        props.isRounded ? "rounded-2xl" : "rounded-none"
      }`}
    >
      <div className="flex items-center gap-4 mb-4">
        <img
          src={props.pic}
          className="w-16 h-16 rounded-full object-cover bg-zinc-100"
        />
        <div>
          <h3 className="font-bold text-lg dark:text-white">{props.name}</h3>
          <p className="w-full text-zinc-500 font-light text-sm">
            {props.role}
          </p>
        </div>
      </div>

      <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
        {props.des1}
      </p>

      <div className="flex-grow" />

      <div className="flex justify-between items-center pt-4 mt-4 border-t border-zinc-100 dark:border-zinc-800">
        <div className="flex gap-2">
          {props.insta && (
            <a
              href={props.insta}
              className="p-1.5 text-zinc-400 hover:text-blue-500 transition-colors"
            >
              <Instagram size={16} />
            </a>
          )}
          {props.linkedin && (
            <a
              href={props.linkedin}
              className="p-1.5 text-zinc-400 hover:text-blue-500 transition-colors"
            >
              <Linkedin size={16} />
            </a>
          )}
          {props.github && (
            <a
              href={props.github}
              className="p-1.5 text-zinc-400 hover:text-blue-500 transition-colors"
            >
              <Github size={16} />
            </a>
          )}
        </div>
        
        <a
          href="#"
          className="text-xs font-bold text-zinc-500 hover:text-black dark:hover:text-white uppercase tracking-wider"
        >
          Placeholder
        </a>
      </div>
    </div>
  );
}
