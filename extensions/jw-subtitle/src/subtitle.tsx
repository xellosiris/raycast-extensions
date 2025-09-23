import { Action, ActionPanel, Detail } from "@raycast/api";

type Props = {
  url: string;
  subtitle: string;
  title: string;
};

export default function Subtitle({ url, subtitle, title }: Props) {
  return (
    <Detail
      markdown={`## ${title}\n\n${subtitle}`}
      actions={
        <ActionPanel>
          <Action.OpenInBrowser title="Open in Browser" url={url} />
          <Action.CopyToClipboard title="Copy Subtitle to Clipboard" content={subtitle.replace(/\n\n/g, "\n")} />
        </ActionPanel>
      }
    />
  );
}
