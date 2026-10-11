"""Generate the review PDF from the portfolio's confirmed content export."""
import json
import sys
from html import escape
from pathlib import Path
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, KeepTogether

with open(sys.argv[1]) as source:
    data = json.load(source)
output = Path(sys.argv[2])
output.parent.mkdir(parents=True, exist_ok=True)
navy = colors.HexColor("#172a40")
styles = {
    "name": ParagraphStyle("name", fontName="Helvetica-Bold", fontSize=18, leading=21, textColor=navy, alignment=TA_CENTER),
    "contact": ParagraphStyle("contact", fontName="Helvetica", fontSize=9, leading=12, alignment=TA_CENTER),
    "section": ParagraphStyle("section", fontName="Helvetica-Bold", fontSize=10, leading=13, textColor=navy, spaceBefore=9, spaceAfter=4),
    "role": ParagraphStyle("role", fontName="Helvetica-Bold", fontSize=9.3, leading=12, spaceBefore=4, spaceAfter=2),
    "body": ParagraphStyle("body", fontName="Helvetica", fontSize=9.2, leading=12),
    "bullet": ParagraphStyle("bullet", fontName="Helvetica", fontSize=9.2, leading=12, leftIndent=9, firstLineIndent=-7, spaceAfter=1),
}

def text(value):
    return escape(value.replace("—", "-").replace("–", "-"))

def paragraph(value, style="body"):
    return Paragraph(value, styles[style])

profile = data["profile"]
experience = data["experience"]
story = [paragraph(text(profile["fullName"].upper()), "name"), paragraph(text(profile["role"]), "contact")]
contacts = [(profile["email"], profile["email"].removeprefix("mailto:")), (profile["github"], "GitHub"), (profile["linkedin"], "LinkedIn")]
story.append(paragraph(' &nbsp; | &nbsp; '.join(f'<link href="{escape(url, quote=True)}" color="#245978">{text(label)}</link>' for url, label in contacts), "contact"))
story.extend([paragraph("PROFILE", "section"), paragraph(text(experience["summary"]))])
story.append(paragraph("TECHNICAL SKILLS", "section"))
for group in data["skills"]:
    story.append(paragraph(f'<b>{text(group["name"])}:</b> {text(", ".join(group["items"]))}'))
story.append(paragraph("PROFESSIONAL EXPERIENCE", "section"))
for role in experience["roles"]:
    lines = [paragraph(f'{text(role["title"])} | {text(role["company"])} <font name="Helvetica">- {text(role["period"])}</font>', "role")]
    lines.extend(paragraph("- " + text(item), "bullet") for item in role["highlights"])
    story.append(KeepTogether(lines))
story.append(paragraph("SELECTED PROJECTS", "section"))
for project in data["projects"]:
    story.append(KeepTogether([
        paragraph(f'{text(project["name"])} | {text(project["scope"])} | In development', "role"),
        paragraph(text(project["description"])),
        paragraph(text("; ".join(project["highlights"])) + "."),
    ]))
story.extend([paragraph("EDUCATION", "section"), paragraph(text(" | ".join(experience["education"].values())))])
doc = SimpleDocTemplate(str(output), pagesize=A4, rightMargin=34, leftMargin=34, topMargin=28, bottomMargin=28, title=profile["fullName"] + " - Resume", author=profile["fullName"])
doc.build(story)
print(output)
