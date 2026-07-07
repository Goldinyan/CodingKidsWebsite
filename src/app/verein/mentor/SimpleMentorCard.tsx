import { useTheme, type Theme } from "@/context/ThemeContext";
import type { Mentor } from "@/BackEnd/type";
import Image from "next/image";
import { Github, Instagram, Linkedin, Twitter } from "lucide-react";

export type SimpleMentorCardProps = Mentor & {
  onExpand?: () => void;
  isFirst?: boolean;
  isExpanded?: boolean;
};

export function SimpleMentorCard({ props }: { props: SimpleMentorCardProps }) {
  const { theme, isRounded } = useTheme();

  return (
    <div
      className={` w-full h-full bg-white/2.5 backdrop-blur-2xl p-6 border border-zinc-200 dark:border-zinc-800 transition-all duration-300 flex flex-col ${isRounded ? "rounded-2xl" : "rounded-none"
        }`}
    >
      <div className="flex items-center gap-4 mb-4">
        <Image
          alt={props.name}
          src={"/" + props.pic}
          width={64}
          height={64}
          className="w-12 h-12 rounded-xl object-cover bg-zinc-100"
        />
        <div>
          <h3
            className={`font-bold text-md font-gro ${theme == "dark" ? "text-white" : "text-black"}`}
          >
            {props.name}
          </h3>
          <p className="w-full text-purple-400 font-light text-xxs font-mono">
            {props.role}
          </p>
        </div>
      </div>

      <p className="text-zinc-600 dark:text-zinc-400 text-xs md:text-sm font-gro leading-relaxed">
        {props.des}
      </p>

      <div className="grow min-h-5" />

      <div className="flex justify-between items-center pt-4   border-t border-zinc-100 dark:border-zinc-800">
        {(props.insta || props.linkedin || props.github) && (
          <div className="flex items-center gap-2 ">
            {props.insta && (
              <a
                href={props.insta}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg text-zinc-400 bg-white/5 backdrop-blur-2xl hover:text-purple-400 transition-colors"
              >
                <Instagram size={16} />
              </a>
            )}
            {props.linkedin && (
              <a
                href={props.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg text-zinc-400 bg-white/5 backdrop-blur-2xl hover:text-purple-400 transition-colors"
              >
                <Linkedin size={16} />
              </a>
            )}
            {props.github && (
              <a
                href={props.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg text-zinc-400 bg-white/5 backdrop-blur-2xl hover:text-purple-400 transition-colors"
              >
                <Github size={16} />
              </a>
            )}
          </div>
        )}
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
