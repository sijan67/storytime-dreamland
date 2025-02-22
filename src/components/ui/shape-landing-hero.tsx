"use client";

import { motion } from "framer-motion";
import { Moon, Star } from "lucide-react";
import { cn } from "@/lib/utils";

function StarShape({
    className,
    delay = 0,
    size = 24,
    rotate = 0,
    color = "text-yellow-300",
}: {
    className?: string;
    delay?: number;
    size?: number;
    rotate?: number;
    color?: string;
}) {
    return (
        <motion.div
            initial={{
                opacity: 0,
                y: -150,
                rotate: rotate - 15,
            }}
            animate={{
                opacity: 1,
                y: 0,
                rotate: rotate,
            }}
            transition={{
                duration: 2.4,
                delay,
                ease: [0.23, 0.86, 0.39, 0.96],
                opacity: { duration: 1.2 },
            }}
            className={cn("absolute", className)}
        >
            <motion.div
                animate={{
                    y: [0, 15, 0],
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 12,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                }}
                className="relative"
            >
                <Star className={cn("w-full h-full", color)} size={size} fill="currentColor" />
            </motion.div>
        </motion.div>
    );
}

interface HeroGeometricProps {
  badge?: string;
  title1?: string;
  title2?: string;
  children?: React.ReactNode;
}

function HeroGeometric({
    badge = "Bedtime Stories",
    title1 = "Sweet Dreams &",
    title2 = "Magical Adventures",
    children,
}: HeroGeometricProps) {
    const fadeUpVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                duration: 1,
                delay: 0.5 + i * 0.2,
                ease: [0.25, 0.4, 0.25, 1],
            },
        }),
    };

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#1A1F2C]">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-transparent to-purple-900/30 blur-3xl" />

            <div className="absolute inset-0 overflow-hidden">
                <StarShape
                    delay={0.3}
                    size={64}
                    rotate={12}
                    color="text-yellow-200"
                    className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
                />

                <StarShape
                    delay={0.5}
                    size={56}
                    rotate={-15}
                    color="text-yellow-100"
                    className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
                />

                <StarShape
                    delay={0.4}
                    size={48}
                    rotate={-8}
                    color="text-yellow-300"
                    className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
                />

                <StarShape
                    delay={0.6}
                    size={40}
                    rotate={20}
                    color="text-yellow-200"
                    className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
                />

                <StarShape
                    delay={0.7}
                    size={36}
                    rotate={-25}
                    color="text-yellow-100"
                    className="left-[20%] md:left-[25%] top-[5%] md:top-[10%]"
                />

                <StarShape
                    delay={0.8}
                    size={52}
                    rotate={15}
                    color="text-yellow-200"
                    className="left-[40%] top-[8%]"
                />

                <StarShape
                    delay={0.9}
                    size={44}
                    rotate={-20}
                    color="text-yellow-100"
                    className="right-[35%] bottom-[15%]"
                />

                <StarShape
                    delay={1.0}
                    size={58}
                    rotate={25}
                    color="text-yellow-300"
                    className="left-[30%] bottom-[25%]"
                />

                <StarShape
                    delay={1.1}
                    size={50}
                    rotate={-12}
                    color="text-yellow-200"
                    className="right-[25%] top-[45%]"
                />

                <StarShape
                    delay={1.2}
                    size={42}
                    rotate={18}
                    color="text-yellow-100"
                    className="left-[15%] top-[35%]"
                />
            </div>

            <div className="relative z-10 container mx-auto px-4 md:px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <motion.div
                        custom={0}
                        variants={fadeUpVariants}
                        initial="hidden"
                        animate="visible"
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] mb-8 md:mb-12"
                    >
                        <Moon className="h-4 w-4 text-yellow-200" />
                        <Star className="h-3 w-3 text-yellow-200" />
                        <span className="text-sm text-white/80 tracking-wide">
                            {badge}
                        </span>
                    </motion.div>

                    <motion.div
                        custom={1}
                        variants={fadeUpVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold mb-6 md:mb-8 tracking-tight">
                            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80">
                                {title1}
                            </span>
                            <br />
                            <span
                                className={cn(
                                    "bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 via-white/90 to-yellow-200"
                                )}
                            >
                                {title2}
                            </span>
                        </h1>
                    </motion.div>

                    <motion.div
                        custom={2}
                        variants={fadeUpVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {children}
                    </motion.div>
                </div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-[#1A1F2C] via-transparent to-[#1A1F2C]/80 pointer-events-none" />
        </div>
    );
}

export { HeroGeometric }
