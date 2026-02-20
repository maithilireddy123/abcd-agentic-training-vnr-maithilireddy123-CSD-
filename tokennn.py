import re

text = input("Enter a string: ")

print("\nOriginal String:")
print(text)

tokens_space = text.split()

tokens_comma = text.split(",")

tokens_regex = re.findall(r'\b\w+\b', text)

print("\nTokenization using space:")
for token in tokens_space:
    print(token)

print("\nTokenization using comma:")
for token in tokens_comma:
    print(token)

print("\nTokenization using regular expression:")
for token in tokens_regex:
    print(token)

print("\nTotal number of words (regex method):", len(tokens_regex))
