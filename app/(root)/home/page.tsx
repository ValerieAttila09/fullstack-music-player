"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Home() {
	return (
		<div className="">
			<Button
				variant={'outline'}
				size={"default"}
				onClick={() => toast.success("Toast Info!", {
					description: `Toast telah ditekan!`,
					action: {
						label: "Undo",
						onClick: () => console.log("Undo")
					}
				})}
			>
				Click Me
			</Button>
		</div>
	);
} 