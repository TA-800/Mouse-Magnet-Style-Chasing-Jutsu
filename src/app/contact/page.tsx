import React from "react";
import { BlogPost } from "../page";

export default function Contact() {
    return (
        <BlogPost title="Reach Me?" author="TheWeakNinja" date="31 January 2053">
            <p>Hey there.</p>
            <br />
            <p>
                If you've made it this far down my website, it probably means you're looking for a way to get in touch with me.
                And let me tell you, that's a fantastic idea! You never know what kind of exciting opportunities could come out of
                a good old-fashioned conversation.
            </p>
            <br />
            <p>So, without further ado, here are some ways to reach me:</p>
            <br />
            <span>
                <ul className="flex flex-col gap-2 ml-4">
                    <li>
                        <strong>Carrier pigeon</strong>
                        <p className="opacity-75">Attach your message to the leg of a pigeon and hope it finds me.</p>
                    </li>
                    <li>
                        <strong>Morse code</strong>
                        <p className="opacity-75">Tap out your message on a telegraph and hope I'm listening.</p>
                    </li>
                    <li>
                        <strong>Smoke signals</strong>
                        <p className="opacity-75">Build a fire and hope I see the smoke.</p>
                    </li>
                </ul>
            </span>
            <br />

            <p>
                And that's it! I look forward to hearing from you, no matter what method you choose to contact me. Just please, no
                carrier llamas. I've had some bad experiences in the past. If you any suggestions for other ways to contact me,
                keep them to yourself. I don't want to hear them.
            </p>
            <br />

            <p>Cheers,</p>
            <p>
                <s>ChatGP</s> eh er I mean, me.
            </p>
        </BlogPost>
    );
}
