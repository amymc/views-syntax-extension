;(global => {
  const checkPage = () => {
    // pr diff page
    if (/pull/.test(location.href)) {
      const headers = Array.from(document.querySelectorAll('.file-header'))

      headers.forEach(header => {
        if (/\.view$/.test(header.getAttribute('data-path'))) {
          const table = header.nextElementSibling.querySelectorAll('tbody')[0]
          checkLayout(table)
        }
      })
      // regular file page
    } else if (/\.view$/.test(location.href)) {
      const table = document.querySelectorAll(
        '.repository-content .file tbody'
      )[0]
      applyFileSyntax(table)
    }
  }

  // check if it's unified or split(default)
  const checkLayout = table => {
    if (/diff=unified$/.test(location.href)) {
      applyPRSyntax(2, table)
    } else {
      applyPRSyntax(1, table)
      applyPRSyntax(3, table)
    }
  }

  const applyPRSyntax = (index, table) => {
    // what if there are pluses or minuses at the begining of the line?

    const rows = Array.from(table.children)
    rows.forEach(row => {
      if (
        !row.children[index] ||
        /\bempty-cell\b/.test(row.children[index].className)
      )
        return

      if (/^(\+)?(\-)?[A-Z]/.test(row.innerText.trim())) {
        // debugger
        let lines = row.children[index].innerHTML.split(
          '<span class="blob-code-inner">'
        )
        // debugger
        if (lines[1]) {
          let lineSubstrings = lines[1].trim().split(' ')

          lineSubstrings[0] = `<span style="color:#ff8300;">${
            lineSubstrings[0]
          }</span>`
          lines[1] = lineSubstrings.join(' ')
          row.children[index].innerHTML = lines.join(
            '<span class="blob-code-inner">'
          )
        }
      } else if (/^#.+$/.test(row.innerText.trim())) {
        // comments
        row.children[index].style.color = '#7DB1B9B3'
      } else if (row.innerText.includes('onWhen')) {
        // TODO: move this
        // trim the row because the first character is always
        // either '+', '-' or a blank space
        const trimmedStr = row.innerText.match(/[a-z](.+)/)

        // now split it because the before and after columns are one row 😬
        const columns = trimmedStr[0].split(/\s\s\s/)
        // trimmedStr[0] = `<span style="color:#A2E1F90;">${trimmedStr[0]}</span>`
        row.children[index].innerHTML = row.children[index].innerHTML
          .replace(
            columns[0],
            `<span style="color:#A2E1F9;">${columns[0]}</span>`
          )
          .replace(
            columns[1],
            `<span style="color:#A2E1F9;">${columns[1]}</span>`
          )

        //row.children[index].children[1].style.color = '#A2E1F9'
      } else if (/^[a-z]/.test(row.innerText.trim())) {
        // strings
        // debugger
        // for (i = 1; i < substrings.length; i++) {
        //   substrings[i] = `<span style="color:#1FCC69;">${substrings[i]}</span>`
        // }
      } else {
        applyCommonSyntax(row, index)
      }
    })
  }

  const applyCommonSyntax = (row, index) => {
    // comments
    //debugger
    // if (/^(\+)?(\-)?#.+$/.test(row.innerText.trim())) {
    //   row.children[index].style.color = '#7DB1B9B3'
    //   // } else if (row.innerText.includes('onWhen')) {
    //   //   // debugger
    //   //   row.children[index].children[1].style.color = '#A2E1F9'
    // } else
    if (row.innerText.includes('when')) {
      row.children[index].style.color = '#00AEEF'
    }
  }

  const applyFileSyntax = table => {
    console.log('applying syntax')

    const rows = Array.from(table.children)

    if (rows[0].children[1].innerHTML.includes('<span style="color:#ff8300;">'))
      return

    rows.forEach(row => {
      // debugger
      let substrings = row.children[1].innerHTML.split(' ')

      if (/^[A-Z]/.test(row.innerText)) {
        // block names
        substrings[0] = `<span style="color:#ff8300;">${substrings[0]}</span>`
      } else if (/^#.+$/.test(row.innerText)) {
        // comments
        row.children[1].style.color = '#7DB1B9B3'
      } else if (row.innerText.includes('onWhen')) {
        row.children[1].style.color = '#A2E1F9'
        // } else if (row.innerText.includes('when')) {
        //   row.children[1].style.color = '#00AEEF'
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
      } else {
        applyCommonSyntax(row, 1)
      }
      row.children[1].innerHTML = substrings.join(' ')
    })
  }

  checkPage()
})()
