export function extractTextAndCode(html: string): string {
    const dom = new DOMParser().parseFromString(html, "text/html");
    const resultParts: string[] = [];
  
    // Hàm phụ để detect đoạn code và bọc markdown
    function detectAndMarkdownCode(text: string): string {
      const blocks = text.split(/\n{2,}/);
      const codeIndicators = ["if", "for", "repeat", "swap", ":=", "end", "then"];
  
      return blocks
        .map((block) => {
          const lines = block.split("\n");
          const hasCodeIndicator = codeIndicators.some((kw) =>
            block.toLowerCase().includes(kw)
          );
  
          // Nếu đoạn có nhiều dòng và chứa từ khóa code => wrap markdown
          if (lines.length > 1 && hasCodeIndicator) {
            return "```\n" + block + "\n```";
          }
          return block;
        })
        .join("\n\n");
    }
  
    // Xử lý các thẻ <p>, thay <br> bằng newline
    dom.querySelectorAll("p").forEach((p) => {
      const cloned = p.cloneNode(true) as HTMLElement;
      cloned.querySelectorAll("br").forEach((br) => br.replaceWith("\n"));
      const text = cloned.textContent?.trim();
      if (text) resultParts.push(detectAndMarkdownCode(text));
    });
  
    // Lấy nội dung <code> và <pre> (thường là code thật), cũng wrap markdown luôn
    dom.querySelectorAll("code, pre").forEach((el) => {
      const text = el.textContent?.trim();
      if (text) {
        // Nếu chưa có dấu ``` thì thêm vào
        if (!text.startsWith("```")) {
          resultParts.push("```\n" + text + "\n```");
        } else {
          resultParts.push(text);
        }
      }
    });
  
    // Xử lý danh sách <ul>, <ol>
    dom.querySelectorAll("ul, ol").forEach((list) => {
      const isOrdered = list.tagName.toLowerCase() === "ol";
      const items: string[] = [];
      list.querySelectorAll("li").forEach((li, idx) => {
        const itemText = li.textContent?.trim();
        if (itemText) {
          const prefix = isOrdered ? `${idx + 1}.` : "-";
          items.push(`${prefix} ${itemText}`);
        }
      });
      if (items.length) resultParts.push(items.join("\n"));
    });
  
    return resultParts.join("\n\n").trim();
  }
  