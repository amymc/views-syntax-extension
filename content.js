;(global => {
  const checkFile = () => {
    const fileName = document
      .querySelectorAll('.repository-content a')[0]
      .getAttribute('href')

    const re = new RegExp('.view$')
    const isView = re.exec(fileName)

    const headers = Array.from(document.querySelectorAll('.file-header'))

    headers.forEach(header => {
      if (/\.view$/.test(header.getAttribute('data-path'))) {
        console.log(header, ' is view file')
        console.log('heyyyy', header.nextElementSibling)
        const table = header.nextElementSibling.querySelectorAll('tbody')[0]
        applyPRSyntax(table)
      }
    })
    // if (isView) {
    //   const table = document.querySelectorAll(
    //     '.repository-content .file tbody'
    //   )[0]
    //   applySyntax(table)
    // }
  }

  const applyPRSyntax = table => {
    // debugger
    // what if there are pluses or minuses at the begining of the line?
    // need to run the conditions on children[1] and children[3]
    // unified layout!
    const rows = Array.from(table.children)
    rows.forEach(row => {
      // debugger
      if (/^[A-Z]/.test(row.innerText.trim())) {
        let lines = row.children[1].innerHTML.split(
          '<span class="blob-code-inner">'
        )
        let lineSubstrings = lines[1].trim().split(' ')

        lineSubstrings[0] = `<span style="color:#ff8300;"> ${
          lineSubstrings[0]
        }</span>`
        lines[1] = lineSubstrings.join(' ')
        row.children[1].innerHTML = lines.join('<span class="blob-code-inner">')
      } else if (/^#.+$/.test(row.innerText.trim())) {
        // comments
        row.children[1].style.color = '#7DB1B9B3'
      } else if (row.innerText.includes('onWhen')) {
        // debugger
        if (row.children[1].children[1]) {
          row.children[1].children[1].style.color = '#A2E1F9'
        }
        // else {
        //   row.children[3].children[1].style.color = '#A2E1F9'
        // }
      }
    })
  }

  // loop through .file-header and check data-path for '.view'
  // if its a match find the next '.js-file-content table'
  // applySyntax() on it

  const applySyntax = table => {
    console.log('applying syntax')

    const rows = Array.from(table.children)

    if (rows[0].children[1].innerHTML.includes('<span style="color:#ff8300;">'))
      return

    rows.forEach(row => {
      debugger
      let substrings = row.children[1].innerHTML.split(' ')

      if (/^[A-Z]/.test(row.innerText)) {
        // block names
        substrings[0] = `<span style="color:#ff8300;">${substrings[0]}</span>`
      } else if (/^#.+$/.test(row.innerText)) {
        // comments
        row.children[1].style.color = '#7DB1B9B3'
      } else if (row.innerText.includes('onWhen')) {
        row.children[1].style.color = '#A2E1F9'
      } else if (row.innerText.includes('when')) {
        row.children[1].style.color = '#00AEEF'
      } else if (row.innerText.includes('<')) {
        // slots
        substrings[1] = `<span style="color:#00AEEF;">${substrings[1]}</span>`
        for (i = 2; i < substrings.length; i++) {
          substrings[i] = `<span style="color:#1FCC69;">${substrings[i]}</span>`
        }
      } else if (/^[a-z]/.test(row.innerText)) {
        // strings
        for (i = 1; i < substrings.length; i++) {
          substrings[i] = `<span style="color:#1FCC69;">${substrings[i]}</span>`
        }
      }
      row.children[1].innerHTML = substrings.join(' ')
    })
  }

  checkFile()
})()
