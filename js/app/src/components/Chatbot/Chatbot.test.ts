import { test, describe, assert, afterEach } from "vitest";
import { cleanup, render, get_text } from "@gradio/tootils";
import Chatbot from "./Chatbot.svelte";
import type { LoadingStatus } from "../StatusTracker/types";

const loading_status: LoadingStatus = {
	eta: 0,
	queue_position: 1,
	queue_size: 1,
	status: "complete",
	scroll_to_output: false,
	visible: true,
	fn_index: 0,
	show_progress: "full"
};

describe.skip("Chatbot", () => {
	afterEach(() => cleanup());

	test("renders user and bot messages", async () => {
		const { getAllByTestId } = await render(Chatbot, {
			loading_status,
			label: "hello",
			value: [["user message one", "bot message one"]],
			root: "",
			root_url: "",
			latex_delimiters: [{ left: "$$", right: "$$", display: true }],
			theme_mode: "dark"
		});

		const bot = getAllByTestId("user")[0];
		const user = getAllByTestId("bot")[0];

		assert.equal(get_text(bot), "user message one");
		assert.equal(get_text(user), "bot message one");
	});

	test("renders additional message as they are passed", async () => {
		const { component, getAllByTestId } = await render(Chatbot, {
			loading_status,
			label: "hello",
			value: [["user message one", "bot message one"]],
			root: "",
			root_url: "",
			latex_delimiters: [{ left: "$$", right: "$$", display: true }],
			theme_mode: "dark"
		});

		await component.$set({
			value: [
				["user message one", "bot message one"],
				["user message two", "bot message two"]
			]
		});

		const user_2 = getAllByTestId("user");
		const bot_2 = getAllByTestId("bot");

		assert.equal(user_2.length, 2);
		assert.equal(bot_2.length, 2);

		assert.equal(get_text(user_2[1]), "user message two");
		assert.equal(get_text(bot_2[1]), "bot message two");
	});
});
