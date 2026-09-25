import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import { navLinks } from "../constants";
import ThemeButton from "./ThemeButton";
import Menu from "./../public/assets/icons/menu.svg";
import Close from "./../public/assets/icons/close.svg";
import { slideIn } from "@/utils/motion";

function Navbar() {
  const [active, setActive] = useState("");
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      // When near the top (Hero section), no link is active
      const aboutElement = document.getElementById("about");
      if (aboutElement) {
        const aboutTop = aboutElement.getBoundingClientRect().top + scrollY;
        if (scrollY < aboutTop - 300) {
          setActive("");
          return;
        }
      } else if (scrollY < 200) {
        setActive("");
        return;
      }

      // When near the bottom of the page, activate Contact
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      if (scrollY + windowHeight >= docHeight - 100) {
        setActive("Contact");
        return;
      }

      // Check sections from bottom to top
      const triggerPoint = scrollY + windowHeight * 0.35;
      for (let i = navLinks.length - 1; i >= 0; i--) {
        const nav = navLinks[i];
        const element = document.getElementById(nav.id);
        if (element) {
          const elementTop = element.getBoundingClientRect().top + scrollY;
          if (triggerPoint >= elementTop) {
            setActive(nav.title);
            return;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <nav
        className={`paddingX w-full flex items-center py-5 fixed top-0 z-30 bg-transparent backdrop-filter backdrop-blur-xl bg-opacity-60`}
      >
        <div className="w-full flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              onClick={() => {
                setActive("");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <p className="dark:text-ctnPrimaryDark text-ctnPrimaryLight text-[18px] font-bold cursor-pointer flex ">
                Utsav D &nbsp;
                <span className="lg:block hidden"> | AI & Data Science Developer</span>
              </p>
            </Link>
          </div>

          <ul className="list-none hidden md:flex flex-row gap-10 items-center">
            {navLinks.map((nav) => (
              <li
                key={nav.id}
                className={`dark:text-ctnPrimaryDark text-ctnPrimaryLight border-secondary transition-all duration-200 ease-in text-[18px] font-medium cursor-pointer ${
                  active === nav.title
                    ? "text-quaternary dark:text-quaternary border-b-2 border-quaternary"
                    : "hover:text-tertiary hover:dark:text-tertiary hover:border-y-2"
                }`}
                onClick={() => setActive(nav.title)}
              >
                <a href={`#${nav.id}`}>{nav.title}</a>
              </li>
            ))}
            <li
              className={`text-white hover:text-white text-[18px] font-medium cursor-pointer`}
            >
              <ThemeButton />
            </li>
          </ul>

          <div className="md:hidden flex flex-1 justify-end items-center">
            <div
              className="w-[28px] h-[28px] object-contain text-ctnPrimaryLight dark:text-ctnPrimaryDark flex justify-center items-center cursor-pointer"
              onClick={() => setToggle(!toggle)}
            >
              {toggle ? (
                <Close className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </div>

            <motion.div
              variants={slideIn("right", "tween", 0, 0.3)}
              initial="hidden"
              whileInView="show"
              className={`${
                !toggle ? "hidden" : "flex"
              } p-6 bg-bgSecondaryLight dark:bg-bgSecondaryDark absolute top-20 right-0 mx-4 my-2 min-w-[140px] z-10 rounded-xl`}
            >
              <ul className="list-none flex justify-end items-start flex-1 flex-col gap-4">
                {navLinks.map((nav) => (
                  <li
                    key={nav.id}
                    className={`font-poppins font-medium cursor-pointer text-[16px] ${
                      active === nav.title
                        ? "text-secondary"
                        : "dark:text-ctnPrimaryDark text-ctnPrimaryLight"
                    }`}
                    onClick={() => {
                      setToggle(!toggle);
                      setActive(nav.title);
                    }}
                  >
                    <a href={`#${nav.id}`}>{nav.title}</a>
                  </li>
                ))}
                <li
                  className={`text-white hover:text-white text-[18px] font-medium cursor-pointer`}
                >
                  <ThemeButton />
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
