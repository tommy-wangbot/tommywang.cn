#!/usr/bin/env python3
"""把构建出的共享页头同步到原生 HTML 交互图，并检查所有页面覆盖。"""
from html.parser import HTMLParser
from pathlib import Path
import re
import sys

class HeaderParser(HTMLParser):
    def __init__(self, source):
        super().__init__(convert_charrefs=False)
        self.source = source
        self.offsets = [0]
        for line in source.splitlines(keepends=True):
            self.offsets.append(self.offsets[-1] + len(line))
        self.start = self.end = None
        self.depth = 0

    def position(self):
        line, column = self.getpos()
        return self.offsets[line - 1] + column

    def handle_starttag(self, tag, attrs):
        if tag == 'header':
            if self.depth:
                self.depth += 1
            elif dict(attrs).get('data-site-header') == 'bear-b':
                self.start = self.position()
                self.depth = 1

    def handle_endtag(self, tag):
        if tag == 'header' and self.depth:
            self.depth -= 1
            if not self.depth:
                self.end = self.position() + len('</header>')

def header_span(source):
    parser = HeaderParser(source)
    parser.feed(source)
    if parser.start is None or parser.end is None:
        raise ValueError('没有完整的共享页头')
    return parser.start, parser.end

def main():
    dist = Path(sys.argv[1] if len(sys.argv) > 1 else 'dist')
    reference = (dist / 'research/index.html').read_text()
    start, end = header_span(reference)
    header = reference[start:end]
    for route in ['diagrams/judgment-line.html']:
        path = dist / route
        source = path.read_text()
        if 'data-site-header="bear-b"' in source:
            start, end = header_span(source)
            source = source[:start] + source[end:]
        body = re.search(r'<body\b[^>]*>', source, re.I)
        if not body:
            raise ValueError(f'{route} 没有 body')
        tag = body.group()
        if 'site-with-header' not in tag:
            if re.search(r'\bclass="', tag):
                tag = tag.replace('class="', 'class="site-with-header ', 1)
            else:
                tag = tag[:-1] + ' class="site-with-header">'
        source = source[:body.start()] + tag + header + source[body.end():]
        path.write_text(source)
    covered, skipped, missing = [], [], []
    for path in sorted(dist.rglob('*.html')):
        source = path.read_text()
        route = str(path.relative_to(dist))
        if path.name.startswith('baidu_verify_') or re.search(r'<meta[^>]+http-equiv="refresh"', source, re.I):
            skipped.append(route)
            continue
        if source.count('data-site-header="bear-b"') != 1:
            missing.append(route)
        else:
            covered.append(route)
    if missing:
        raise ValueError('共享页头覆盖检查失败：' + ', '.join(missing))
    print(f'共享页头覆盖通过：{len(covered)} 个页面；{len(skipped)} 个改址/验证文件保留原样。')

if __name__ == '__main__':
    main()
