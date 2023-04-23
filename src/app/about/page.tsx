import React from "react";
import { BlogPost } from "../page";

export default function About() {
    return (
        <BlogPost title="About this small little mouse thingy" author="TheWeakNinja" date="January 1, 2021">
            <p>
                Hey there, I&apos;m the <strong>human</strong> behind this whole mouse follower project! I never thought I&apos;d
                be so invested in something as seemingly trivial as a mouse follower, but here I am, spending hours on end
                tinkering with its behavior and appearance.
            </p>
            <br />
            <p>
                But let me tell you, it&apos;s been a fun ride! It&apos;s amazing how much you can learn about web development
                just by building something as simple as a mouse follower. I mean, who knew that you could use the transform
                property to scale and rotate elements, or that you could use CSS variables to make your code more modular and
                reusable?
            </p>
            <br />
            <p>
                Of course, building something like this isn&apos;t without its challenges. For example, figuring out how to center
                the mouse follower over a magnetic button was a bit of a headache. And don&apos;t even get me started on trying to
                get the scroll event handler to fire at the right time!
            </p>
            <br />
            <p>
                But in the end, it&apos;s all worth it. There&apos;s something satisfying about seeing your code come to life and
                interact with the user in a meaningful way. And hey, if all else fails, at least I&apos;ve got a nifty little
                mouse follower to play around with on this site!
            </p>
            <br />
            <p>
                Now if you&apos;ll excuse me, I&apos;ve got some more tinkering to do. Who knows, maybe I&apos;ll even add some
                fancy new features like particle effects or custom cursor icons. The possibilities are endless! By the way, the
                name for this mouse following element is gonna be &quot;Magnet Style: Chasing Jutsu&quot;. If you have any
                suggestions for a better name, feel free to let me know!
            </p>
            <br />
            <br />
            <p className="opacity-30 text-xs">Thank you ChatGPT for the quick write up on this &quot;About Me&quot; content.</p>
        </BlogPost>
    );
}
