import { Action, ActionPanel, Form, Icon, showToast, Toast, useNavigation } from "@raycast/api";
import axios from "axios";
import { useState } from "react";
import { WebVTTParser } from "webvtt-parser";
import Subtitle from "./subtitle";
const parser = new WebVTTParser();

export default function Command() {
  const [url, setUrl] = useState("");
  const { push } = useNavigation();
  async function handleSubmit() {
    try {
      showToast({ style: Toast.Style.Animated, title: "Fetching..." });
      if (!url.startsWith("https://www.jw.org/finder?srcid=share")) {
        throw new Error("Invalid URL from jw.org");
      }
      const urlParams = new URL(url).searchParams;
      const lang = urlParams.get("wtlocale");
      const lank = urlParams.get("lank");
      const itemInfoUrl = `https://b.jw-cdn.org/apis/mediator/v1/media-items/${lang}/${lank}`;
      const { data } = await axios.get(itemInfoUrl);
      if (!data || !data.media || data.media.length === 0) {
        throw new Error("No media or subtitle found");
      }
      const subtitleURL = data.media[0].files[0].subtitles.url;
      const res = await axios.get(subtitleURL);
      const subtitles = parser
        .parse(res.data, "subtitles")
        .cues.map((s) => s.text)
        .join("\n\n");
      const title = data.media[0].title;
      push(<Subtitle subtitle={subtitles} title={title} url={url} />);
      showToast({ style: Toast.Style.Success, title: "Subtitle fetched successfully!" });
    } catch (error) {
      showToast({ style: Toast.Style.Failure, title: "Error", message: String(error) });
    }
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm icon={Icon.Download} title="Fetch Subtitle" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField
        id="query"
        title="Video URL"
        placeholder="paste video URL here..."
        value={url}
        onChange={setUrl}
      />
    </Form>
  );
}
