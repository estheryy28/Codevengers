**Login Page:**  
You are given a task to integrate an existing React component in the codebase

The codebase should support:  
\- shadcn project structure    
\- Tailwind CSS  
\- Typescript

If it doesn't, provide instructions on how to setup project via shadcn CLI, install Tailwind or Typescript.

Determine the default path for components and styles.   
If default path for components is not /components/ui, provide instructions on why it's important to create this folder  
Copy-paste this component to /components/ui folder:  
\`\`\`tsx  
gaming-login.tsx  
'use client';  
import React, { useState, useRef, useEffect } from 'react';  
import { Eye, EyeOff, Mail, Lock, Chrome, Twitter, Gamepad2 } from 'lucide-react';

interface LoginFormProps {  
    onSubmit: (email: string, password: string, remember: boolean) \=\> void;  
}

interface VideoBackgroundProps {  
    videoUrl: string;  
}

interface FormInputProps {  
    icon: React.ReactNode;  
    type: string;  
    placeholder: string;  
    value: string;  
    onChange: (e: React.ChangeEvent\<HTMLInputElement\>) \=\> void;  
    required?: boolean;  
}

interface SocialButtonProps {  
    icon: React.ReactNode;  
    name: string;  
}

interface ToggleSwitchProps {  
    checked: boolean;  
    onChange: () \=\> void;  
    id: string;  
}

// FormInput Component  
const FormInput: React.FC\<FormInputProps\> \= ({ icon, type, placeholder, value, onChange, required }) \=\> {  
    return (  
        \<div className="relative"\>  
            \<div className="absolute left-3 top-1/2 \-translate-y-1/2"\>  
                {icon}  
            \</div\>  
            \<input  
                type={type}  
                placeholder={placeholder}  
                value={value}  
                onChange={onChange}  
                required={required}  
                className="w-full pl-10 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-purple-500/50 transition-colors"  
            /\>  
        \</div\>  
    );  
};

// SocialButton Component  
const SocialButton: React.FC\<SocialButtonProps\> \= ({ icon }) \=\> {  
    return (  
        \<button className="flex items-center justify-center p-2 bg-white/5 border border-white/10 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors"\>  
            {icon}  
        \</button\>  
    );  
};

// ToggleSwitch Component  
const ToggleSwitch: React.FC\<ToggleSwitchProps\> \= ({ checked, onChange, id }) \=\> {  
    return (  
        \<div className="relative inline-block w-10 h-5 cursor-pointer"\>  
            \<input  
                type="checkbox"  
                id={id}  
                className="sr-only"  
                checked={checked}  
                onChange={onChange}  
            /\>  
            \<div className={\`absolute inset-0 rounded-full transition-colors duration-200 ease-in-out ${checked ? 'bg-purple-600' : 'bg-white/20'}\`}\>  
                \<div className={\`absolute left-0.5 top-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-200 ease-in-out ${checked ? 'transform translate-x-5' : ''}\`} /\>  
            \</div\>  
        \</div\>  
    );  
};

// VideoBackground Component  
const VideoBackground: React.FC\<VideoBackgroundProps\> \= ({ videoUrl }) \=\> {  
    const videoRef \= useRef\<HTMLVideoElement\>(null);

    useEffect(() \=\> {  
        if (videoRef.current) {  
            videoRef.current.play().catch(error \=\> {  
                console.error("Video autoplay failed:", error);  
            });  
        }  
    }, \[\]);

    return (  
        \<div className="absolute inset-0 w-full h-full overflow-hidden"\>  
            \<div className="absolute inset-0 bg-black/30 z-10" /\>  
            \<video  
                ref={videoRef}  
                className="absolute inset-0 min-w-full min-h-full object-cover w-auto h-auto"  
                autoPlay  
                loop  
                muted  
                playsInline  
            \>  
                \<source src={videoUrl} type="video/mp4" /\>  
                Your browser does not support the video tag.  
            \</video\>  
        \</div\>  
    );  
};

// Main LoginForm Component  
const LoginForm: React.FC\<LoginFormProps\> \= ({ onSubmit }) \=\> {  
    const \[email, setEmail\] \= useState('');  
    const \[password, setPassword\] \= useState('');  
    const \[showPassword, setShowPassword\] \= useState(false);  
    const \[remember, setRemember\] \= useState(false);  
    const \[isSubmitting, setIsSubmitting\] \= useState(false);  
    const \[isSuccess, setIsSuccess\] \= useState(false);

    const handleSubmit \= async (e: React.FormEvent) \=\> {  
        e.preventDefault();  
        setIsSubmitting(true);

        await new Promise(resolve \=\> setTimeout(resolve, 1000));  
        setIsSuccess(true);  
        await new Promise(resolve \=\> setTimeout(resolve, 500));

        onSubmit(email, password, remember);  
        setIsSubmitting(false);  
        setIsSuccess(false);  
    };

    return (  
        \<div className="p-8 rounded-2xl backdrop-blur-sm bg-black/50 border border-white/10"\>  
            \<div className="mb-8 text-center"\>  
                \<h2 className="text-3xl font-bold mb-2 relative group"\>  
                    \<span className="absolute \-inset-1 bg-gradient-to-r from-purple-600/30 via-pink-500/30 to-blue-500/30 blur-xl opacity-75 group-hover:opacity-100 transition-all duration-500 animate-pulse"\>\</span\>  
                    \<span className="relative inline-block text-3xl font-bold mb-2 text-white"\>  
                        NexusGate  
                    \</span\>  
                    \<span className="absolute \-inset-0.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300"\>\</span\>  
                \</h2\>  
                \<p className="text-white/80 flex flex-col items-center space-y-1"\>  
                    \<span className="relative group cursor-default"\>  
                        \<span className="absolute \-inset-1 bg-gradient-to-r from-purple-600/20 to-pink-600/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"\>\</span\>  
                        \<span className="relative inline-block animate-pulse"\>Your gaming universe awaits\</span\>  
                    \</span\>  
                    \<span className="text-xs text-white/50 animate-pulse"\>  
                        \[Press Enter to join the adventure\]  
                    \</span\>  
                    \<div className="flex space-x-2 text-xs text-white/40"\>  
                        \<span className="animate-pulse"\>⚔️\</span\>  
                        \<span className="animate-bounce"\>🎮\</span\>  
                        \<span className="animate-pulse"\>🏆\</span\>  
                    \</div\>  
                \</p\>  
            \</div\>

            \<form onSubmit={handleSubmit} className="space-y-6"\>  
                \<FormInput  
                    icon={\<Mail className="text-white/60" size={18} /\>}  
                    type="email"  
                    placeholder="Email address"  
                    value={email}  
                    onChange={(e) \=\> setEmail(e.target.value)}  
                    required  
                /\>

                \<div className="relative"\>  
                    \<FormInput  
                        icon={\<Lock className="text-white/60" size={18} /\>}  
                        type={showPassword ? "text" : "password"}  
                        placeholder="Password"  
                        value={password}  
                        onChange={(e) \=\> setPassword(e.target.value)}  
                        required  
                    /\>  
                    \<button  
                        type="button"  
                        className="absolute right-3 top-1/2 \-translate-y-1/2 text-white/60 hover:text-white focus:outline-none transition-colors"  
                        onClick={() \=\> setShowPassword(\!showPassword)}  
                        aria-label={showPassword ? "Hide password" : "Show password"}  
                    \>  
                        {showPassword ? \<EyeOff size={18} /\> : \<Eye size={18} /\>}  
                    \</button\>  
                \</div\>

                \<div className="flex items-center justify-between"\>  
                    \<div className="flex items-center space-x-2"\>  
                        \<div onClick={() \=\> setRemember(\!remember)} className="cursor-pointer"\>  
                            \<ToggleSwitch  
                                checked={remember}  
                                onChange={() \=\> setRemember(\!remember)}  
                                id="remember-me"  
                            /\>  
                        \</div\>  
                        \<label  
                            htmlFor="remember-me"  
                            className="text-sm text-white/80 cursor-pointer hover:text-white transition-colors"  
                            onClick={() \=\> setRemember(\!remember)}  
                        \>  
                            Remember me  
                        \</label\>  
                    \</div\>  
                    \<a href="\#" className="text-sm text-white/80 hover:text-white transition-colors"\>  
                        Forgot password?  
                    \</a\>  
                \</div\>

                \<button  
                    type="submit"  
                    disabled={isSubmitting}  
                    className={\`w-full py-3 rounded-lg ${isSuccess  
                            ? 'animate-success'  
                            : 'bg-purple-600 hover:bg-purple-700'  
                        } text-white font-medium transition-all duration-200 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40\`}  
                \>  
                    {isSubmitting ? 'Logging in...' : 'Enter NexusGate'}  
                \</button\>  
            \</form\>

            \<div className="mt-8"\>  
                \<div className="relative flex items-center justify-center"\>  
                    \<div className="border-t border-white/10 absolute w-full"\>\</div\>  
                    \<div className="bg-transparent px-4 relative text-white/60 text-sm"\>  
                        quick access via  
                    \</div\>  
                \</div\>

                \<div className="mt-6 grid grid-cols-3 gap-3"\>  
                    \<SocialButton icon={\<Chrome size={18} /\>} name="Chrome" /\>  
                    \<SocialButton icon={\<Twitter size={18} /\>} name="X" /\>  
                    \<SocialButton icon={\<Gamepad2 size={18} /\>} name="Steam" /\>  
                \</div\>  
            \</div\>

            \<p className="mt-8 text-center text-sm text-white/60"\>  
                Don't have an account?{' '}  
                \<a href="\#" className="font-medium text-white hover:text-purple-300 transition-colors"\>  
                    Create Account  
                \</a\>  
            \</p\>  
        \</div\>  
    );  
};

// Export as default components  
const LoginPage \= {  
    LoginForm,  
    VideoBackground  
};

export default LoginPage;

demo.tsx  
'use client';  
import LoginPage from './components/ui/gaming-login';

function App() {  
  const handleLogin \= (email: string, password: string, remember: boolean) \=\> {  
    console.log('Login attempt:', { email, password, remember });  
  };

  return (  
    \<div className="relative min-h-screen w-full flex items-center justify-center px-4 py-12"\>  
      \<LoginPage.VideoBackground videoUrl="https://videos.pexels.com/video-files/8128311/8128311-uhd\_2560\_1440\_25fps.mp4" /\>

      \<div className="relative z-20 w-full max-w-md animate-fadeIn"\>  
        \<LoginPage.LoginForm onSubmit={handleLogin} /\>  
      \</div\>

      \<footer className="absolute bottom-4 left-0 right-0 text-center text-white/60 text-sm z-20"\>  
        © 2025 NexusGate. All rights reserved.  
      \</footer\>  
    \</div\>  
  );  
}

export default App;  
\`\`\`

Install NPM dependencies:  
\`\`\`bash  
lucide-react  
\`\`\`

Extend existing Tailwind 4 index.css with this code (or if project uses Tailwind 3, extend tailwind.config.js or globals.css):  
\`\`\`css  
@import "tailwindcss";  
@import "tw-animate-css";

\`\`\`

Implementation Guidelines  
 1\. Analyze the component structure and identify all required dependencies  
 2\. Review the component's argumens and state  
 3\. Identify any required context providers or hooks and install them  
 4\. Questions to Ask  
 \- What data/props will be passed to this component?  
 \- Are there any specific state management requirements?  
 \- Are there any required assets (images, icons, etc.)?  
 \- What is the expected responsive behavior?  
 \- What is the best place to use this component in the app?

Steps to integrate  
 0\. Copy paste all the code above in the correct directories  
 1\. Install external dependencies  
 2\. Fill image assets with Unsplash stock images you know exist  
 3\. Use lucide-react icons for svgs or logos if component requires them

**Entering the website:**  
You are given a task to integrate an existing React component in the codebase

The codebase should support:  
\- shadcn project structure    
\- Tailwind CSS  
\- Typescript

If it doesn't, provide instructions on how to setup project via shadcn CLI, install Tailwind or Typescript.

Determine the default path for components and styles.   
If default path for components is not /components/ui, provide instructions on why it's important to create this folder  
Copy-paste this component to /components/ui folder:  
\`\`\`tsx  
spiral-animation.tsx  
'use client'  
import { useEffect, useRef, useState } from 'react'  
import { gsap } from 'gsap'

// 向量工具类  
class Vector2D {  
    constructor(public x: number, public y: number) {}  
      
    static random(min: number, max: number): number {  
        return min \+ Math.random() \* (max \- min)  
    }  
}

class Vector3D {  
    constructor(public x: number, public y: number, public z: number) {}  
      
    static random(min: number, max: number): number {  
        return min \+ Math.random() \* (max \- min)  
    }  
}

// 动画控制器  
class AnimationController {  
    private timeline: gsap.core.Timeline  
    private time \= 0  
    private canvas: HTMLCanvasElement  
    private ctx: CanvasRenderingContext2D  
    private dpr: number  
    private size: number  
    private stars: Star\[\] \= \[\]  
      
    // 常量  
    private readonly changeEventTime \= 0.32  
    private readonly cameraZ \= \-400  
    private readonly cameraTravelDistance \= 3400  
    private readonly startDotYOffset \= 28  
    private readonly viewZoom \= 100  
    private readonly numberOfStars \= 5000  
    private readonly trailLength \= 80  
      
    constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, dpr: number, size: number) {  
        this.canvas \= canvas  
        this.ctx \= ctx  
        this.dpr \= dpr  
        this.size \= size  
        this.timeline \= gsap.timeline({ repeat: \-1 })  
          
        // 初始化  
        this.setupRandomGenerator()  
        this.createStars()  
        this.setupTimeline()  
    }  
      
    // 设置随机数生成器  
    private setupRandomGenerator() {  
        const originalRandom \= Math.random  
        const customRandom \= () \=\> {  
            let seed \= 1234  
            return () \=\> {  
                seed \= (seed \* 9301 \+ 49297\) % 233280  
                return seed / 233280  
            }  
        }  
          
        Math.random \= customRandom()  
        this.createStars()  
        Math.random \= originalRandom  
    }  
      
    // 创建星星  
    private createStars() {  
        for (let i \= 0; i \< this.numberOfStars; i++) {  
            this.stars.push(new Star(this.cameraZ, this.cameraTravelDistance))  
        }  
    }  
      
    // 设置动画时间线  
    private setupTimeline() {  
        this.timeline  
            .to(this, {  
                time: 1,  
                duration: 15,  
                repeat: \-1,  
                ease: "none",  
                onUpdate: () \=\> this.render()  
            })  
    }  
      
    // 缓动函数  
    public ease(p: number, g: number): number {  
        if (p \< 0.5)   
            return 0.5 \* Math.pow(2 \* p, g)  
        else  
            return 1 \- 0.5 \* Math.pow(2 \* (1 \- p), g)  
    }  
      
    // 弹性缓动  
    public easeOutElastic(x: number): number {  
        const c4 \= (2 \* Math.PI) / 4.5  
        if (x \<= 0\) return 0  
        if (x \>= 1\) return 1  
        return Math.pow(2, \-8 \* x) \* Math.sin((x \* 8 \- 0.75) \* c4) \+ 1  
    }  
      
    // 映射函数  
    public map(value: number, start1: number, stop1: number, start2: number, stop2: number): number {  
        return start2 \+ (stop2 \- start2) \* ((value \- start1) / (stop1 \- start1))  
    }  
      
    // 限制范围  
    public constrain(value: number, min: number, max: number): number {  
        return Math.min(Math.max(value, min), max)  
    }  
      
    // 线性插值  
    public lerp(start: number, end: number, t: number): number {  
        return start \* (1 \- t) \+ end \* t  
    }  
      
    // 螺旋路径  
    public spiralPath(p: number): Vector2D {  
        p \= this.constrain(1.2 \* p, 0, 1\)  
        p \= this.ease(p, 1.8)  
        const numberOfSpiralTurns \= 6  
        const theta \= 2 \* Math.PI \* numberOfSpiralTurns \* Math.sqrt(p)  
        const r \= 170 \* Math.sqrt(p)  
          
        return new Vector2D(  
            r \* Math.cos(theta),  
            r \* Math.sin(theta) \+ this.startDotYOffset  
        )  
    }  
      
    // 旋转变换  
    public rotate(v1: Vector2D, v2: Vector2D, p: number, orientation: boolean): Vector2D {  
        const middle \= new Vector2D(  
            (v1.x \+ v2.x) / 2,  
            (v1.y \+ v2.y) / 2  
        )  
          
        const dx \= v1.x \- middle.x  
        const dy \= v1.y \- middle.y  
        const angle \= Math.atan2(dy, dx)  
        const o \= orientation ? \-1 : 1  
        const r \= Math.sqrt(dx \* dx \+ dy \* dy)  
          
        // 弹性效果  
        const bounce \= Math.sin(p \* Math.PI) \* 0.05 \* (1 \- p)  
          
        return new Vector2D(  
            middle.x \+ r \* (1 \+ bounce) \* Math.cos(angle \+ o \* Math.PI \* this.easeOutElastic(p)),  
            middle.y \+ r \* (1 \+ bounce) \* Math.sin(angle \+ o \* Math.PI \* this.easeOutElastic(p))  
        )  
    }  
      
    // 投影点  
    public showProjectedDot(position: Vector3D, sizeFactor: number) {  
        const t2 \= this.constrain(this.map(this.time, this.changeEventTime, 1, 0, 1), 0, 1\)  
        const newCameraZ \= this.cameraZ \+ this.ease(Math.pow(t2, 1.2), 1.8) \* this.cameraTravelDistance  
          
        if (position.z \> newCameraZ) {  
            const dotDepthFromCamera \= position.z \- newCameraZ  
              
            // 3D \-\> 2D投影公式  
            const x \= this.viewZoom \* position.x / dotDepthFromCamera  
            const y \= this.viewZoom \* position.y / dotDepthFromCamera  
            const sw \= 400 \* sizeFactor / dotDepthFromCamera  
              
            this.ctx.lineWidth \= sw  
            this.ctx.beginPath()  
            this.ctx.arc(x, y, 0.5, 0, Math.PI \* 2\)  
            this.ctx.fill()  
        }  
    }  
      
    // 绘制起始点  
    private drawStartDot() {  
        if (this.time \> this.changeEventTime) {  
            const dy \= this.cameraZ \* this.startDotYOffset / this.viewZoom  
            const position \= new Vector3D(0, dy, this.cameraTravelDistance)  
            this.showProjectedDot(position, 2.5)  
        }  
    }  
      
    // 主渲染函数  
    public render() {  
        const ctx \= this.ctx  
        if (\!ctx) return  
          
        ctx.fillStyle \= 'black'  
        ctx.fillRect(0, 0, this.size, this.size)  
          
        ctx.save()  
        ctx.translate(this.size / 2, this.size / 2\)  
          
        // 计算时间参数  
        const t1 \= this.constrain(this.map(this.time, 0, this.changeEventTime \+ 0.25, 0, 1), 0, 1\)  
        const t2 \= this.constrain(this.map(this.time, this.changeEventTime, 1, 0, 1), 0, 1\)  
          
        // 旋转相机  
        ctx.rotate(-Math.PI \* this.ease(t2, 2.7))  
          
        // 绘制轨迹  
        this.drawTrail(t1)  
          
        // 绘制星星  
        ctx.fillStyle \= 'white'  
        for (const star of this.stars) {  
            star.render(t1, this)  
        }  
          
        // 绘制起始点  
        this.drawStartDot()  
          
        ctx.restore()  
    }  
      
    // 绘制轨迹  
    private drawTrail(t1: number) {  
        for (let i \= 0; i \< this.trailLength; i++) {  
            const f \= this.map(i, 0, this.trailLength, 1.1, 0.1)  
            const sw \= (1.3 \* (1 \- t1) \+ 3.0 \* Math.sin(Math.PI \* t1)) \* f  
              
            this.ctx.fillStyle \= 'white'  
            this.ctx.lineWidth \= sw  
              
            const pathTime \= t1 \- 0.00015 \* i  
            const position \= this.spiralPath(pathTime)  
              
            // 添加旋转效果  
            const basePos \= position  
            const offset \= new Vector2D(position.x \+ 5, position.y \+ 5\)  
            const rotated \= this.rotate(  
                basePos,   
                offset,   
                Math.sin(this.time \* Math.PI \* 2\) \* 0.5 \+ 0.5,   
                i % 2 \=== 0  
            )  
              
            this.ctx.beginPath()  
            this.ctx.arc(rotated.x, rotated.y, sw / 2, 0, Math.PI \* 2\)  
            this.ctx.fill()  
        }  
    }  
      
    // 暂停动画  
    public pause() {  
        this.timeline.pause()  
    }  
      
    // 恢复动画  
    public resume() {  
        this.timeline.play()  
    }  
      
    // 销毁动画  
    public destroy() {  
        this.timeline.kill()  
    }  
}

// 星星类  
class Star {  
    private dx: number  
    private dy: number  
    private spiralLocation: number  
    private strokeWeightFactor: number  
    private z: number  
    private angle: number  
    private distance: number  
    private rotationDirection: number // 旋转方向  
    private expansionRate: number // 扩散速率  
    private finalScale: number // 最终尺寸比例  
      
    constructor(cameraZ: number, cameraTravelDistance: number) {  
        this.angle \= Math.random() \* Math.PI \* 2  
        this.distance \= 30 \* Math.random() \+ 15  
        this.rotationDirection \= Math.random() \> 0.5 ? 1 : \-1  
        this.expansionRate \= 1.2 \+ Math.random() \* 0.8 // 增加扩散率从0.8-1.2到1.2-2.0  
        this.finalScale \= 0.7 \+ Math.random() \* 0.6 // 0.7-1.3之间的最终尺寸  
          
        this.dx \= this.distance \* Math.cos(this.angle)  
        this.dy \= this.distance \* Math.sin(this.angle)  
          
        this.spiralLocation \= (1 \- Math.pow(1 \- Math.random(), 3.0)) / 1.3  
        this.z \= Vector2D.random(0.5 \* cameraZ, cameraTravelDistance \+ cameraZ)  
          
        const lerp \= (start: number, end: number, t: number) \=\> start \* (1 \- t) \+ end \* t  
        this.z \= lerp(this.z, cameraTravelDistance / 2, 0.3 \* this.spiralLocation)  
        this.strokeWeightFactor \= Math.pow(Math.random(), 2.0)  
    }  
      
    render(p: number, controller: AnimationController) {  
        const spiralPos \= controller.spiralPath(this.spiralLocation)  
        const q \= p \- this.spiralLocation  
          
        if (q \> 0\) {  
            const displacementProgress \= controller.constrain(4 \* q, 0, 1\)  
              
            // 使用混合缓动函数，柔和开始，有弹性结束  
            const linearEasing \= displacementProgress;  
            const elasticEasing \= controller.easeOutElastic(displacementProgress);  
            const powerEasing \= Math.pow(displacementProgress, 2);  
              
            // 混合不同缓动效果，创造更自然的动画  
            let easing;  
            if (displacementProgress \< 0.3) {  
                // 开始阶段：主要是线性和二次方  
                easing \= controller.lerp(linearEasing, powerEasing, displacementProgress / 0.3);  
            } else if (displacementProgress \< 0.7) {  
                // 中间阶段：过渡到弹性  
                const t \= (displacementProgress \- 0.3) / 0.4;  
                easing \= controller.lerp(powerEasing, elasticEasing, t);  
            } else {  
                // 最终阶段：弹性效果  
                easing \= elasticEasing;  
            }  
              
            // 计算位置偏移  
            let screenX, screenY;  
              
            // 分阶段应用不同的运动模式  
            if (displacementProgress \< 0.3) {  
                // 初始阶段：直线移动 (30%)  
                screenX \= controller.lerp(spiralPos.x, spiralPos.x \+ this.dx \* 0.3, easing / 0.3);  
                screenY \= controller.lerp(spiralPos.y, spiralPos.y \+ this.dy \* 0.3, easing / 0.3);  
            } else if (displacementProgress \< 0.7) {  
                // 中间阶段：曲线移动 (40%)  
                const midProgress \= (displacementProgress \- 0.3) / 0.4;  
                const curveStrength \= Math.sin(midProgress \* Math.PI) \* this.rotationDirection \* 1.5;  
                  
                // 基础位置（30%直线距离）  
                const baseX \= spiralPos.x \+ this.dx \* 0.3;  
                const baseY \= spiralPos.y \+ this.dy \* 0.3;  
                  
                // 目标位置（70%距离）  
                const targetX \= spiralPos.x \+ this.dx \* 0.7;  
                const targetY \= spiralPos.y \+ this.dy \* 0.7;  
                  
                // 添加曲线偏移  
                const perpX \= \-this.dy \* 0.4 \* curveStrength;  
                const perpY \= this.dx \* 0.4 \* curveStrength;  
                  
                screenX \= controller.lerp(baseX, targetX, midProgress) \+ perpX \* midProgress;  
                screenY \= controller.lerp(baseY, targetY, midProgress) \+ perpY \* midProgress;  
            } else {  
                // 最终阶段：更强的螺旋扩散 (30%)  
                const finalProgress \= (displacementProgress \- 0.7) / 0.3;  
                  
                // 基础位置（70%直线距离）  
                const baseX \= spiralPos.x \+ this.dx \* 0.7;  
                const baseY \= spiralPos.y \+ this.dy \* 0.7;  
                  
                // 最终位置（更远距离）  
                const targetDistance \= this.distance \* this.expansionRate \* 1.5;  
                const spiralTurns \= 1.2 \* this.rotationDirection;  
                const spiralAngle \= this.angle \+ spiralTurns \* finalProgress \* Math.PI;  
                  
                const targetX \= spiralPos.x \+ targetDistance \* Math.cos(spiralAngle);  
                const targetY \= spiralPos.y \+ targetDistance \* Math.sin(spiralAngle);  
                  
                // 应用缓动  
                screenX \= controller.lerp(baseX, targetX, finalProgress);  
                screenY \= controller.lerp(baseY, targetY, finalProgress);  
            }  
              
            // 将2D屏幕坐标转换为3D空间坐标  
            const vx \= (this.z \- controller\['cameraZ'\]) \* screenX / controller\['viewZoom'\];  
            const vy \= (this.z \- controller\['cameraZ'\]) \* screenY / controller\['viewZoom'\];  
              
            const position \= new Vector3D(vx, vy, this.z);  
              
            // 粒子大小动画：初始正常，中间稍微变大，最终根据finalScale调整  
            let sizeMultiplier \= 1.0;  
            if (displacementProgress \< 0.6) {  
                // 前60%：略微膨胀  
                sizeMultiplier \= 1.0 \+ displacementProgress \* 0.2;  
            } else {  
                // 后40%：过渡到最终尺寸  
                const t \= (displacementProgress \- 0.6) / 0.4;  
                sizeMultiplier \= 1.2 \* (1.0 \- t) \+ this.finalScale \* t;  
            }  
              
            const dotSize \= 8.5 \* this.strokeWeightFactor \* sizeMultiplier;  
              
            controller.showProjectedDot(position, dotSize);  
        }  
    }  
}

export function SpiralAnimation() {  
    const canvasRef \= useRef\<HTMLCanvasElement\>(null)  
    const animationRef \= useRef\<AnimationController | null\>(null)  
    const \[dimensions, setDimensions\] \= useState({ width: window.innerWidth, height: window.innerHeight })  
      
    // 处理窗口大小变化  
    useEffect(() \=\> {  
        const handleResize \= () \=\> {  
            setDimensions({  
                width: window.innerWidth,  
                height: window.innerHeight  
            })  
        }  
          
        handleResize()  
        window.addEventListener('resize', handleResize)  
        return () \=\> window.removeEventListener('resize', handleResize)  
    }, \[\])  
      
    // 创建和管理动画  
    useEffect(() \=\> {  
        const canvas \= canvasRef.current  
        if (\!canvas) return  
          
        const ctx \= canvas.getContext('2d')  
        if (\!ctx) return  
          
        // 处理DPR以解决模糊问题  
        const dpr \= window.devicePixelRatio || 1  
        // 使用全屏尺寸  
        const size \= Math.max(dimensions.width, dimensions.height)  
          
        canvas.width \= size \* dpr  
        canvas.height \= size \* dpr  
          
        // 设置CSS尺寸  
        canvas.style.width \= \`${dimensions.width}px\`  
        canvas.style.height \= \`${dimensions.height}px\`  
          
        // 缩放上下文以适应DPR  
        ctx.scale(dpr, dpr)  
          
        // 创建动画控制器  
        animationRef.current \= new AnimationController(canvas, ctx, dpr, size)  
          
        return () \=\> {  
            // 清理动画  
            if (animationRef.current) {  
                animationRef.current.destroy()  
                animationRef.current \= null  
            }  
        }  
    }, \[dimensions\])  
      
    return (  
        \<div className="relative w-full h-full"\>  
            \<canvas  
                ref={canvasRef}  
                className="absolute inset-0 w-full h-full"  
            /\>  
        \</div\>  
    )  
}

demo.tsx  
'use client'

import { SpiralAnimation } from "@/components/ui/spiral-animation"  
import { useState, useEffect } from 'react'

const SpiralDemo \= () \=\> {  
  const \[startVisible, setStartVisible\] \= useState(false)  
    
  // Handle navigation to personal site  
  const navigateToPersonalSite \= () \=\> {  
    window.location.href \= "https://xubh.top/"  
  }  
    
  // Fade in the start button after animation loads  
  useEffect(() \=\> {  
    const timer \= setTimeout(() \=\> {  
      setStartVisible(true)  
    }, 2000\)  
      
    return () \=\> clearTimeout(timer)  
  }, \[\])  
    
  return (  
    \<div className="fixed inset-0 w-full h-full overflow-hidden bg-black"\>  
      {/\* Spiral Animation \*/}  
      \<div className="absolute inset-0"\>  
        \<SpiralAnimation /\>  
      \</div\>  
        
      {/\* Simple Elegant Text Button with Pulsing Effect \*/}  
      \<div   
        className={\`  
          absolute left-1/2 top-1/2 \-translate-x-1/2 \-translate-y-1/2 z-10  
          transition-all duration-1500 ease-out  
          ${startVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}  
        \`}  
      \>  
        \<button   
          onClick={navigateToPersonalSite}  
          className="  
            text-white text-2xl tracking-\[0.2em\] uppercase font-extralight  
            transition-all duration-700  
            hover:tracking-\[0.3em\] animate-pulse  
          "  
        \>  
          Enter  
        \</button\>  
      \</div\>  
    \</div\>  
  )  
}

export {SpiralDemo}

\`\`\`

Install NPM dependencies:  
\`\`\`bash  
gsap  
\`\`\`

Implementation Guidelines  
 1\. Analyze the component structure and identify all required dependencies  
 2\. Review the component's argumens and state  
 3\. Identify any required context providers or hooks and install them  
 4\. Questions to Ask  
 \- What data/props will be passed to this component?  
 \- Are there any specific state management requirements?  
 \- Are there any required assets (images, icons, etc.)?  
 \- What is the expected responsive behavior?  
 \- What is the best place to use this component in the app?

Steps to integrate  
 0\. Copy paste all the code above in the correct directories  
 1\. Install external dependencies  
 2\. Fill image assets with Unsplash stock images you know exist  
 3\. Use lucide-react icons for svgs or logos if component requires them

**Admin Dashhboard &  Coding Background**  
You are given a task to integrate an existing React component in the codebase

The codebase should support:  
\- shadcn project structure    
\- Tailwind CSS  
\- Typescript

If it doesn't, provide instructions on how to setup project via shadcn CLI, install Tailwind or Typescript.

Determine the default path for components and styles.   
If default path for components is not /components/ui, provide instructions on why it's important to create this folder  
Copy-paste this component to /components/ui folder:  
\`\`\`tsx  
dotted-surface.tsx  
'use client';  
import { cn } from '@/lib/utils';  
import { useTheme } from 'next-themes';  
import React, { useEffect, useRef } from 'react';  
import \* as THREE from 'three';

type DottedSurfaceProps \= Omit\<React.ComponentProps\<'div'\>, 'ref'\>;

export function DottedSurface({ className, ...props }: DottedSurfaceProps) {  
	const { theme } \= useTheme();

	const containerRef \= useRef\<HTMLDivElement\>(null);  
	const sceneRef \= useRef\<{  
		scene: THREE.Scene;  
		camera: THREE.PerspectiveCamera;  
		renderer: THREE.WebGLRenderer;  
		particles: THREE.Points\[\];  
		animationId: number;  
		count: number;  
	} | null\>(null);

	useEffect(() \=\> {  
		if (\!containerRef.current) return;

		const SEPARATION \= 150;  
		const AMOUNTX \= 40;  
		const AMOUNTY \= 60;

		// Scene setup  
		const scene \= new THREE.Scene();  
		scene.fog \= new THREE.Fog(0xffffff, 2000, 10000);

		const camera \= new THREE.PerspectiveCamera(  
			60,  
			window.innerWidth / window.innerHeight,  
			1,  
			10000,  
		);  
		camera.position.set(0, 355, 1220);

		const renderer \= new THREE.WebGLRenderer({  
			alpha: true,  
			antialias: true,  
		});  
		renderer.setPixelRatio(window.devicePixelRatio);  
		renderer.setSize(window.innerWidth, window.innerHeight);  
		renderer.setClearColor(scene.fog.color, 0);

		containerRef.current.appendChild(renderer.domElement);

		// Create particles  
		const particles: THREE.Points\[\] \= \[\];  
		const positions: number\[\] \= \[\];  
		const colors: number\[\] \= \[\];

		// Create geometry for all particles  
		const geometry \= new THREE.BufferGeometry();

		for (let ix \= 0; ix \< AMOUNTX; ix++) {  
			for (let iy \= 0; iy \< AMOUNTY; iy++) {  
				const x \= ix \* SEPARATION \- (AMOUNTX \* SEPARATION) / 2;  
				const y \= 0; // Will be animated  
				const z \= iy \* SEPARATION \- (AMOUNTY \* SEPARATION) / 2;

				positions.push(x, y, z);  
				if (theme \=== 'dark') {  
					colors.push(200, 200, 200);  
				} else {  
					colors.push(0, 0, 0);  
				}  
			}  
		}

		geometry.setAttribute(  
			'position',  
			new THREE.Float32BufferAttribute(positions, 3),  
		);  
		geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

		// Create material  
		const material \= new THREE.PointsMaterial({  
			size: 8,  
			vertexColors: true,  
			transparent: true,  
			opacity: 0.8,  
			sizeAttenuation: true,  
		});

		// Create points object  
		const points \= new THREE.Points(geometry, material);  
		scene.add(points);

		let count \= 0;  
		let animationId: number;

		// Animation function  
		const animate \= () \=\> {  
			animationId \= requestAnimationFrame(animate);

			const positionAttribute \= geometry.attributes.position;  
			const positions \= positionAttribute.array as Float32Array;

			let i \= 0;  
			for (let ix \= 0; ix \< AMOUNTX; ix++) {  
				for (let iy \= 0; iy \< AMOUNTY; iy++) {  
					const index \= i \* 3;

					// Animate Y position with sine waves  
					positions\[index \+ 1\] \=  
						Math.sin((ix \+ count) \* 0.3) \* 50 \+  
						Math.sin((iy \+ count) \* 0.5) \* 50;

					i++;  
				}  
			}

			positionAttribute.needsUpdate \= true;

			// Update point sizes based on wave  
			const customMaterial \= material as THREE.PointsMaterial & {  
				uniforms?: any;  
			};  
			if (\!customMaterial.uniforms) {  
				// For dynamic size changes, we'd need a custom shader  
				// For now, keeping constant size for performance  
			}

			renderer.render(scene, camera);  
			count \+= 0.1;  
		};

		// Handle window resize  
		const handleResize \= () \=\> {  
			camera.aspect \= window.innerWidth / window.innerHeight;  
			camera.updateProjectionMatrix();  
			renderer.setSize(window.innerWidth, window.innerHeight);  
		};

		window.addEventListener('resize', handleResize);

		// Start animation  
		animate();

		// Store references  
		sceneRef.current \= {  
			scene,  
			camera,  
			renderer,  
			particles: \[points\],  
			animationId,  
			count,  
		};

		// Cleanup function  
		return () \=\> {  
			window.removeEventListener('resize', handleResize);

			if (sceneRef.current) {  
				cancelAnimationFrame(sceneRef.current.animationId);

				// Clean up Three.js objects  
				sceneRef.current.scene.traverse((object) \=\> {  
					if (object instanceof THREE.Points) {  
						object.geometry.dispose();  
						if (Array.isArray(object.material)) {  
							object.material.forEach((material) \=\> material.dispose());  
						} else {  
							object.material.dispose();  
						}  
					}  
				});

				sceneRef.current.renderer.dispose();

				if (containerRef.current && sceneRef.current.renderer.domElement) {  
					containerRef.current.removeChild(  
						sceneRef.current.renderer.domElement,  
					);  
				}  
			}  
		};  
	}, \[theme\]);

	return (  
		\<div  
			ref={containerRef}  
			className={cn('pointer-events-none fixed inset-0 \-z-1', className)}  
			{...props}  
		/\>  
	);  
}

demo.tsx  
import { DottedSurface } from "@/components/ui/dotted-surface";  
import { cn } from '@/lib/utils';

export default function DemoOne() {  
 return (  
		\<DottedSurface className="size-full"\>  
			\<div className="absolute inset-0 flex items-center justify-center"\>  
				\<div  
					aria-hidden="true"  
					className={cn(  
						'pointer-events-none absolute \-top-10 left-1/2 size-full \-translate-x-1/2 rounded-full',  
						'bg-\[radial-gradient(ellipse\_at\_center,--theme(--color-foreground/.1),transparent\_50%)\]',  
						'blur-\[30px\]',  
					)}  
				/\>  
				\<h1 className="font-mono text-4xl font-semibold"\>Dotted Surface\</h1\>  
			\</div\>  
		\</DottedSurface\>  
	);  
}

\`\`\`

Install NPM dependencies:  
\`\`\`bash  
three, next-themes  
\`\`\`

Implementation Guidelines  
 1\. Analyze the component structure and identify all required dependencies  
 2\. Review the component's argumens and state  
 3\. Identify any required context providers or hooks and install them  
 4\. Questions to Ask  
 \- What data/props will be passed to this component?  
 \- Are there any specific state management requirements?  
 \- Are there any required assets (images, icons, etc.)?  
 \- What is the expected responsive behavior?  
 \- What is the best place to use this component in the app?

Steps to integrate  
 0\. Copy paste all the code above in the correct directories  
 1\. Install external dependencies  
 2\. Fill image assets with Unsplash stock images you know exist  
 3\. Use lucide-react icons for svgs or logos if component requires them

